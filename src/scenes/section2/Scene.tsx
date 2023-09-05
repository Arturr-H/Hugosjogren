import React, { RefObject } from "react";
import "./Styles.css";
import CollectionThumbnail from "../../components/collection/CollectionThumbnail";

/* Interfaces */
interface Props {
    switch: () => void
}
interface State {
	moderatormode: boolean
}

export default class Scene extends React.PureComponent<Props, State> {
	background: RefObject<HTMLImageElement>;
	title: RefObject<HTMLDivElement>;
	foreground: RefObject<HTMLImageElement>;

	loadedNrImages: number = 0;
	moderatorinputs: string[] = [];

	constructor(props: Props) {
		super(props);

		this.state = {
			moderatormode: false
		}

		/* Refs */
		this.background = React.createRef();
		this.title = React.createRef();
		this.foreground = React.createRef();

		/* Bindings */
		this.intro = this.intro.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	/* Lifetime */
	componentDidMount(): void {
		[this.background, this.foreground].forEach(e => {
			e.current!.onload = () => {
				this.loadedNrImages += 1;

				if (this.loadedNrImages == 2) this.intro();
			}
		});

		document.addEventListener("mousemove", this.onMouseMove);
		document.addEventListener("keydown", this.moderatorCheck);
	}
	componentWillUnmount(): void {
		document.removeEventListener("mousemove", this.onMouseMove)
		document.removeEventListener("keydown", this.moderatorCheck)
	}
	moderatorCheck = (e: KeyboardEvent) => {
		this.moderatorinputs.push(e.key);

		let s = this.moderatorinputs.slice(Math.max(this.moderatorinputs.length - 8, 0)).join("");
		if (s === "hugoedit") {
			if (!this.state.moderatormode) {
				alert("moderator enabled 🤷‍♂️");
				this.setState({ moderatormode: true });
			}
		}
	}

	/* Transition to visible */
	intro(): void {
		[this.background, this.foreground, this.title].forEach(e => {
			e.current!.classList.add("animated");
		});
	}

	/* Move effects */
	onMouseMove(ev: MouseEvent): void {
		const CONFIG = { duration: 200, easing: "ease-out", fill: "forwards" };
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
	
		const deltaX = (ev.clientX - centerX) / centerX * 10;
		const deltaY = (ev.clientY - centerY) / centerY * 10;
	
		// Limit the maximum movement to 20px in each direction

		this.background.current?.animate(
			[{ transform: `translate(${deltaX}px, ${deltaY}px) scale(1.025)`}],
			CONFIG as any
		);
		this.foreground.current?.animate(
			[{ transform: `translate(${deltaX*2}px, ${deltaY*2}px) scale(1.05)`}],
			CONFIG as any
		);
		this.title.current?.animate(
			[{ transform: `translate(calc(${deltaX*1.3}px - 50%), calc(${deltaY*1.3}px - 70%))`}],
			CONFIG as any
		);
	}

	render() {
		return (
			<div className="scene2">
				<div className="navbar">
                    <a href="/">HOME</a>
                    <a href="" className="active">MY PROJECTS</a>
                    <a href="/2">ABOUT ME</a>
                </div>
				<div className="pegboard-container">
					<img className="pegboard" src={require("./assets/pegboard.png")} />
					<Collections moderatormode={this.state.moderatormode} />
				</div>
				
				<div className="lingon-image-container">
					<img ref={this.background} className="lingon-image mi-bg" src={require("./assets/lingonberries.png")} />
					
					<div ref={this.title} className="lingon-title-container"><h1 className="lingon-background-title">MY PROJECTS</h1></div>
					
					<img ref={this.foreground} className="lingon-image mi-fg" src={require("./assets/lingonberries-fg.png")} />
				</div>
			</div>
		);
	}
}

interface CollectionsState {
	collections: any[]
}
class Collections extends React.PureComponent<{moderatormode:boolean}, CollectionsState> {
	backendURL: string = "https://hugos-photos-backend.fly.dev/";

	constructor(props: any) {
		super(props);

		this.state = {
			collections: []
		}

		/* Refs */

		/* Bindings */
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		await fetch(this.backendURL + "collections").then(async res => res.json()).then(data => {
            this.setState({ collections: data.collections });
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

	render() {
		return (
			<div className="scroller">
				<div className="collection-container">
				{
					Object.keys(this.state.collections)
					.map(value => ({ value, sort: Math.random() }))
					.sort((a, b) => a.sort - b.sort)
					.map(({ value }) => value)
					.map((key, index) => {
						const collection = this.state.collections[key as any];
						const coverImage = collection.cover_image;

						return (
							<a href={`/collection/${key}`} style={{ color: "unset" }}>
								<CollectionThumbnail
									title={this.convertToRealContent(collection.title)}
									source={this.backendURL + "uploads-compressed/" + coverImage.pathname}
									delay={index*200}
									moderatormode={this.props.moderatormode}
									id={key}
									key={key}
									date={coverImage.date}
								/>
							</a>
						)
					})
				}
				</div>
			</div>
		);
	}
}



