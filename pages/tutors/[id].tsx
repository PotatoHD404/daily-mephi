import {NextRouter, withRouter} from "next/router";
import {Component} from "react";
import {Session} from "next-auth";

class Tutor extends Component<{ session: Session, router: NextRouter }, { id: any }> {

    constructor(props: any) {
        super(props);
        this.state = {id: ''};
    }

    static getDerivedStateFromProps(props: any, state: any){
        return {...state, id: props.router.query.id};
    }


    render() {
        return <><p>ID: {this.state.id}</p></>;
    }
}

export default withRouter(Tutor);