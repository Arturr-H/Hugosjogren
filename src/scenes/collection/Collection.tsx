/* Imports */
import React from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import "./Styles.css";

function withRouter(Component: any) {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

/* Main */
class Collection extends React.PureComponent<any, any> {
    backendURL: string;
    id: any;
    insertedKeys: any;
    imageShow: any;
    
    constructor(props: any) {
        super(props);
        this.state = {
            collection: {},
            showImage: {
                active: false,
                info: {
                    src: "",
                    ort: "",
                    datum: "",
                    kamera: ""
                }
            },

            moderatorMode: false,
        }

        /* Static */
        this.backendURL = "https://hugos-photos-backend.fly.dev/";
        this.id = this.props.router.params.id;

        /* The secret code to unlock moderator mode (requires auth tho) */
		this.insertedKeys = [];

        this.imageShow = React.createRef();
    }

    componentDidMount() {
        /* Remove active if click item not have className="TARGETABLE" */
        document.addEventListener("click", (e) => {
            if ((e.target as any).className.indexOf("TARGETABLE") === -1) {
                this.closeShowImage();
            }
        });

        /* Secret moderation enable */
        document.addEventListener("keydown", (e) => {
			/* We only want 8 chars in the array */
			if (this.insertedKeys.length >= 8)
				this.insertedKeys.shift();

			this.insertedKeys.push(e.key);

			/* If the code is right */
			if (this.insertedKeys.join("") === "hugoedit") {
                alert("Moderator mode enabled 🤓. Asså du är fet discord moderator asså man kolla på dina mobil notiser dom ba bling bling new kitten joined the chat 😂😂😂 liksom varför ha kitten när man kan typ ha riktiga tjejer eller ännu bättre - anime tjejer omg ja måste fan ha en sån nån gång fan va najs de skulle va å ha en tecknad person med sig 😂 (rösterna blir högre) varför skrev jag det här ")
				this.setState({ moderatorMode: true });
			}
		});

        /* Get images */
        fetch(this.backendURL + "get-collection/" + this.id).then(async res => res.json()).then(data => {
            if (data == null) {
                alert("Collection not found");
            } else {
                this.setState({ collection: data });
            }
        })
    }

    /* Convert bytes into real text strings */
    convertToRealContent = (content: any) => {
        let newContent = "";
        let array = new Uint8Array(content);
        for (let i = 0; i < array.length; i++) {
            newContent += String.fromCharCode(array[i]);
        }

        const byteArray = Uint8Array.from(newContent.split(","), x => parseInt(x));
        const result = new TextDecoder().decode(byteArray);

        return result;
    };
    showImage = (src: any, ort: any, datum: any, kamera: any) => {
        this.setState({
            showImage: {
                active: true,
                info: {
                    src: src,
                    ort: ort,
                    datum: datum,
                    kamera: kamera
                }
            }
        })
    }
    closeShowImage = () => {
        this.setState({
            showImage: {
                active: false,
                info: {
                    src: "",
                    ort: "",
                    datum: "",
                    kamera: ""
                }
            }
        })
    }

    /* Download image from <a> tag */
    download = (e: any) => {
        e.preventDefault();
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image-" + Date.now() + ".jpg");
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };
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

    /* Delete image from collection */
    deleteImage = (e: any, pathname: any) => {
        e.stopPropagation();

        fetch(this.backendURL + `delete-image/${pathname}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this.getCookie("_token")
            }
        })
            .then(response => {
                response.json().then(data => {
                    if (data.status === 200) {
                        alert("Image deleted");
                    } else {
                        alert("Image not deleted");
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }


    render() {
        return (
            <section className="collection-with-images">
                <div className="collection-navbar">
                    <a href="/collections"><img className="icon" src={require("./assets/x.svg").default} alt="Close" /></a>
                    <h2 className="title">{this.convertToRealContent(this.state.collection.title)}</h2>
                    <h2 className="collection-size">{this.state.collection.images && this.state.collection.images.length} images</h2>
                </div>
                <div className="images TARGETABLE">
                    {
                        this.state.collection.images && this.state.collection.images
                            .map((value: any, index: any) => ({ value, sort: Math.random() }))
                            .sort(
                                this.state.moderatorMode
                                    ? (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
                                    : (a: any, b: any) => a.sort - b.sort
                                )
                            //@ts-ignore
                            .map(({ value }) => value)
                            .map((image: any, index: any) => {
                                let src = this.backendURL + "uploads-compressed/" + image.pathname;
                                let src_not_compressed = this.backendURL + "uploads/" + image.pathname;
                                return (
                                    <div key={index} className="image TARGETABLE" onClick={() => this.showImage(src_not_compressed, "Icke definerat", image.date, "Nikon")}>
                                        {/* Delete this image button */}
                                        <button onClick={(e) => this.deleteImage(e, image.pathname)} style={{
                                            top: "1vmax",
                                            right: "1vmax",
                                            display: this.state.moderatorMode === true ? "block" : "none"
                                        }} className="collection-delete-button TARGETABLE"></button>

                                        {/* The actual image */}
                                        <img className="TARGETABLE" key={index} src={src} alt="Cover" />

                                        {/* Gradient for hovering */}
                                        <div className="gradient TARGETABLE"></div>

                                        {/* Date and title */}
                                        <p className="title TARGETABLE">{this.convertToRealContent(image.title)}</p>
                                        <p className="date TARGETABLE">{image.date}</p>
                                    </div>
                                )
                            })
                    }
                </div>

                {/* On image click */}
                {this.state.showImage.active ? <div className="image-show-background" ref={this.imageShow}>
                    <div className="TARGETABLE container">
                        <Icon className="close" size={24} icon="x" onClick={this.closeShowImage} />
                        <img alt="backg" src={this.state.showImage.info.src} className="TARGETABLE image-show" />
                        <div className="TARGETABLE info">
                            <div className="TARGETABLE bit">
                                <Icon size={24} icon="calendar" />
                                <p className="TARGETABLE">Datum: </p>
                                <p className="TARGETABLE">{this.state.showImage.info.datum}</p>
                            </div>
                        </div>
                        <a
                            href={this.state.showImage.info.src}
                            className="TARGETABLE download"
                            download
                            onClick={e => this.download(e)}
                        >
                            <p className="TARGETABLE">Download</p>
                            <Icon className="TARGETABLE" size={24} icon="download" />
                        </a>
                    </div>
                </div> : null}
            </section>
        )
    }
}

export default withRouter(Collection);


class Icon extends React.PureComponent<any, any> {
    icons: any;
	constructor(props: any) {
		super(props);
		this.state = {};

		/* Static */
		this.icons = {
            "download": require("./assets/download.svg").default,
            "calendar": require("./assets/calendar.svg").default,
            "x": require("./assets/x.svg").default,
		};
	}

	render() {
		return (
			<img style={{
                width: this.props.size,
                height: this.props.size,
            }} {...this.props} alt={"icon " + this.props.icon} src={this.icons[this.props.icon]} />
		)
	}
}
