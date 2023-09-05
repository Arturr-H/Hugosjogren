import React, { RefObject } from "react";
import "./Styles.css";
import CollectionThumbnail from "../../components/collection/CollectionThumbnail";

/* Interfaces */
interface Props {
    switch: () => void
}
interface State {
}

export default class Scene extends React.PureComponent<Props, State> {
	background: RefObject<HTMLImageElement>;
	title: RefObject<HTMLDivElement>;
	foreground: RefObject<HTMLImageElement>;
	maskText: RefObject<HTMLDivElement>;

	loadedNrImages: number = 0;
	transitioning: boolean = false;

	constructor(props: Props) {
		super(props);

		this.state = {
		}

		/* Refs */
		this.background = React.createRef();
		this.title = React.createRef();
		this.foreground = React.createRef();
		this.maskText = React.createRef();

		/* Bindings */
		this.intro = this.intro.bind(this);
		this.outro = this.outro.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	/* Lifetime */
	componentDidMount(): void {
		document.addEventListener("mousemove", this.onMouseMove);
		[this.background, this.foreground].forEach(e => {
			e.current!.onload = () => {
				this.loadedNrImages += 1;

				if (this.loadedNrImages == 2) this.intro();
			}
		})
	}
	componentWillUnmount(): void {
		document.removeEventListener("mousemove", this.onMouseMove);
	}

	/* Transition to visible */
	intro(): void {
		[this.background, this.foreground, this.title, this.maskText].forEach(e => {
			e.current!.classList.add("animated");
		})
	}
	outro(): void {
		if (this.transitioning) return;
		this.transitioning = true;
		
		// [this.background, this.foreground, this.title, this.maskText].forEach(e => {
		// 	e.current?.animate([ { opacity: 0 }], { duration: 500, fill: "forwards" })
		// })
		setTimeout(() => {
			// this.props.switch();
		}, 700);
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
		this.maskText.current?.animate(
			[{ transform: `translate(calc(${deltaX*1.3}px - 50%), calc(${deltaY*1.3}px - 50%))`}],
			CONFIG as any
		);
		this.title.current?.animate(
			[{ transform: `translate(calc(${deltaX*1.3}px - 50%), calc(${deltaY*1.3}px - 50%))`}],
			CONFIG as any
		);
	}

	render() {
		return (
			<div className="scene3">
				<div className="navbar">
                    <a href="/">HOME</a>
                    <a href="/1">MY PROJECTS</a>
                    <a href="" className="active">ABOUT ME</a>
                </div>

				<div className="abouttext-container" onClick={this.outro}>
					<p className="abouttext">
						I am a 16-year-old photographer based in Stockholm, Sweden. <br />
						I started photographing in the spring of 2022.
						My photography mainly consists of photos taken in the dark forests of western Sweden.
						Apart from nature photography I also enjoy photographing the night sky and twilight evenings.
						You can say that I am an all-around photographer capturing everyday life from late-night summer evenings to cold dark winter nights.
						The purpose of this website is solely to display my photos.

						<br />
						There is no intention to make any money from this at all as it is truly a passion of mine and it gives me great enjoyment that these photos can be shared with the public.
						The photos can be used in whatever way you'd like but it would be a pleasure if you credit me if you use them for a commercial purpose.
						<br /><br />
						For business inquires, please reach out to <a href="mailto: hugosjogren06@gmail.com">hugosjogren06@gmail.com</a>
					</p>
				</div>

				<div className="mushroom-image-container">
					<img ref={this.background} className="mushroom-image mi-bg" src={require("./assets/mushroom-bg.JPG")} />
					
					<div ref={this.title} className="title-container"><h1 className="background-title">~ ABOUT ME ~</h1></div>
					
					<img ref={this.foreground} className="mushroom-image mi-fg" src={require("./assets/mushroom-fg.png")} />
					
					<div ref={this.maskText} className="title-container title-container-background">
						<h1 className="mask-title">~ ABOUT ME ~</h1>
					</div>
				</div>
			</div>
		);
	}
}

