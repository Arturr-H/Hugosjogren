import React, { RefObject } from "react";
import "./Styles.css";

/* Interfaces */
interface Props {
    switch: () => void,
}

export default class Scene extends React.PureComponent<Props> {
    fg1: RefObject<HTMLImageElement>;
    fg2: RefObject<HTMLImageElement>;
    fg3: RefObject<HTMLImageElement>;
    title: RefObject<HTMLHeadingElement>;

    fg1Container: RefObject<HTMLImageElement>;
    fg2Container: RefObject<HTMLImageElement>;
    fg3Container: RefObject<HTMLImageElement>;
    titleContainer: RefObject<HTMLImageElement>;

    istransitioning: boolean = false;
	constructor(props: Props) {
		super(props);

        this.transition = this.transition.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        /* Refs */
        this.fg1 = React.createRef();
        this.fg2 = React.createRef();
        this.fg3 = React.createRef();
        this.fg1Container = React.createRef();
        this.fg2Container = React.createRef();
        this.fg3Container = React.createRef();
        this.titleContainer = React.createRef();
        this.title = React.createRef();
	}

    componentDidMount(): void {
		document.addEventListener("mousemove", this.onMouseMove);
	}
	componentWillUnmount(): void {
		document.removeEventListener("mousemove", this.onMouseMove);
	}

    /** Transition into next scene */
    transition(): void {
        if (this.istransitioning) return;
        
        document.removeEventListener("mousemove", this.onMouseMove);
        this.istransitioning = true;
        document.querySelector(".clicktocontinue")?.classList.add("fadeaway");
        document.querySelector(".navbar")?.classList.add("fadeaway");
            
        [this.fg1, this.fg2, this.fg3, this.titleContainer].forEach(element => {
            element.current?.classList.add("animated");
        });
        setTimeout(this.props.switch, 3000);
    }

    /* Move effects */
	onMouseMove(ev: MouseEvent): void {
        if (this.istransitioning) return;

		const CONFIG = { duration: 200, easing: "ease-out", fill: "forwards" };
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
	
		const deltaX = (ev.clientX - centerX) / centerX * 10;
		const deltaY = (ev.clientY - centerY) / centerY * 10;
	
		// Limit the maximum movement to 20px in each direction

		this.fg1Container.current?.animate(
			[{ transform: `translate(${deltaX*3.5}px, calc(${deltaY*3.5}px + 50%)) scale(2)`}],
			CONFIG as any
		);
		this.fg2Container.current?.animate(
			[{ transform: `translate(${deltaX*2}px, ${deltaY*2}px) scale(1.05)`}],
			CONFIG as any
		);
		this.fg3Container.current?.animate(
			[{ transform: `translate(${deltaX*0.8}px, ${deltaY*0.8}px) scale(1.05)`}],
			CONFIG as any
		);
		this.title.current?.animate(
			[{ transform: `translate(${deltaX*1.6}px, ${deltaY*1.6}px)`}],
			CONFIG as any
		);
	}

	render() {
		return (
			<div className="scene">
                <div className="navbar">
                    <a href="/" className="active">HOME</a>
                    <a href="/1">MY PROJECTS</a>
                    <a href="/2">ABOUT ME</a>
                </div>

                <div className="fg-container" onClick={this.transition}>
                    <div ref={this.fg3Container} className="fgelemcontainer fg3">
                        <img ref={this.fg3} className="fg fg3animate" src={require("./assets/fg-3.png")} />
                    </div>

                    <div ref={this.titleContainer} className="titlecontainer">
                        <h1 className="title" ref={this.title}>HUGO SJÖGREN</h1>
                    </div>

                    <div ref={this.fg2Container} className="fgelemcontainer fg2">
                        <img ref={this.fg2} className="fg fg2animate" src={require("./assets/fg-2.png")} />
                    </div>
                    
                    <div ref={this.fg1Container} className="fgelemcontainer fg1">
                        <div ref={this.fg1} className="fg fg1animate">
                            <img className="fg fg1-image" src={require("./assets/fg-1.png")} />
                            <div className="fg1-gradient" />
                            <div className="bg-black" />
                        </div>
                    </div>
                </div>

                <p className="clicktocontinue">Click to continue</p>
			</div>
		);
	}
}
