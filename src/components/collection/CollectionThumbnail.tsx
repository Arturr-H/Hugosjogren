import React, { RefObject } from "react";
import "./Styles.css";

/* Interfaces */
interface Props {
    source?: string,
	title?: string,
	delay?: number,
	moderatormode: boolean,
	id: string,
	date: string,
}
interface State {
}

export default class CollectionThumbnail extends React.PureComponent<Props, State> {
	backendURL: string = "https://hugos-photos-backend.fly.dev/";
	constructor(props: Props) {
		super(props);

		this.state = {
		}

		/* Refs */
	}

	/* Lifetime */
	componentDidMount(): void {}

	render() {
		return (
			<div className="collection-thumbnail-container">
				<Collection {...this.props} />
			</div>
		);
	}
}

interface Extra { nopin?: boolean, delay?: number }
class Collection extends React.PureComponent<Props & Extra> {
	backendURL: string = "https://hugos-photos-backend.fly.dev/";
	ref: RefObject<HTMLDivElement>;
	constructor(props: Props & Extra) {
		super(props);
		this.ref = React.createRef();
	}

	componentDidMount(): void {
		setTimeout(() => {
			this.ref.current?.animate([
				{ transform: `translate(-100vw, -100vh)` },
				{ transform: `translate(0, 0)` }
			], {
				duration: 500,
				easing: "ease-in-out",
				fill: "forwards",
				delay: (this.props.delay ?? 200) + 3000
			});
		});
	}

    /* Delete collection by it's ID */
    deleteCollection(id: string) {
        if (window.confirm("⚠️⚠️⚠️ OM DET INTE FUNKAR DROPPA AUTH IGEN ⚠️⚠️⚠️ Hugo tycker du att den här kollektionen är skit och du vill radera? 🫢")) {
            fetch(this.backendURL + `delete-collection/${id}`, {
                headers: {
                    token: this.getCookie("_token")
                }
            }).then(async e => await e.json()).then(e => console.log(e)).catch(e => console.log(e));
        }else {
            alert("Du valde att rädda den här fula kollektionen 😂")
        };
    }
	getCookie = (cname: any) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

	render(): React.ReactNode {
		return (
			<div ref={this.ref} className="collection-thumbnail" style={{transform: `translate(-100vw, -100vh)`}}>

				{this.props.moderatormode && <button onClick={() => {
					this.deleteCollection(this.props.id)
				}}>delete</button>}

				{this.props.nopin ? null : <img className="collection-pin" src={require("./assets/pin.png")} />}
				<img className="collection-image" src={this.props.source} />

				<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<p className="collection-title">{this.props.title}</p>
					<p className="collection-date">{this.props.date}</p>
				</div>
			</div>
		)
	}
}
