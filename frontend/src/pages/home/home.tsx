import React from 'react';
import MessageSection from '../../components/messageSection/messageSection';
import {Message} from "../../models/message";
import {toCountry} from "../../models/country";
import ManoAloeService from "../../controllers/mano-aloe.service";
import SessionService from "../../services/session.service";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import {Announcement} from "../../models/announcement"
import './home.css';
import '../../shared/globalStyles/global.css'
import AnnouncementSection from "../../components/announcementSection/announcementSection"

export interface HomePageProps {

}

export interface HomePageState {
    messageLoaded: boolean;
    announcementLoaded: boolean;
    messages: Message[];
    announcements: Announcement[];
}

export default class HomePage extends React.Component<HomePageProps, HomePageState> {

    constructor(props: HomePageProps,
                private manoAloeService: ManoAloeService) {
        super(props);
        this.manoAloeService = new ManoAloeService();
    }

    state: HomePageState = {
        messageLoaded: false,
        announcementLoaded: false,
        messages: [],
        announcements: [],
    }

    componentDidMount() {
        this.getData();
    }

    private getData(): void {
        const cachedMessages: Message[] | null = SessionService.getMessages();
        if (cachedMessages && cachedMessages.length) {
            this.setState({messages: cachedMessages, messageLoaded: true});
        } else {
            this.setState({messageLoaded: false});
            this.manoAloeService.getAllMessages()
                .then((messages: Message[]) => {
                    for (let message of messages) {
                        message.country = toCountry(message.country as string);
                    }
                    SessionService.saveMessages(messages);
                    this.setState({messages, messageLoaded: true});
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
        this.manoAloeService.getAllAnnouncements()
            .then((announcements: Announcement[]) => {
                this.setState({announcements, announcementLoaded: true});
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    renderMessageCardSection() {
        return (
            <div>
                <div className="wrapper-overlay">
                    {this.state.messageLoaded && this.state.announcementLoaded ? <MessageSection data={this.state.messages}/> : <div/>}
                </div>
            </div>
        )
    }

    render() {
        return (
            <section id='anchor'>
                <div className="home-root">
                    {this.renderMessageCardSection()}
                </div>
            </section>
        )
    }
}
