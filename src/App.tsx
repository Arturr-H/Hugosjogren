import React from "react";
import "./App.css";
import Scene1 from "./scenes/section1/Scene";
import Scene2 from "./scenes/section2/Scene";
import Scene3 from "./scenes/section3/Scene";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* Interfaces */
interface State {
	activeScene: number,
}
interface Props {}

class App extends React.PureComponent<Props, State> {
	scenes: JSX.Element[];

	constructor(props: {}) {
		super(props);

		/* State */
		this.state = {
			activeScene: (() => {
				try {
					//@ts-ignore
					let a: number = parseInt(props.router.params.location);
					return Number.isNaN(a) ? 0 : a
				}
				catch {return 0}
			})()
		};

		/* Bindings */
		this.switchScene = this.switchScene.bind(this);

		/* All scenes go here in order */
		this.scenes = [
			<Scene1 switch={this.switchScene} />,
			<Scene2 switch={this.switchScene} />,
			<Scene3 switch={this.switchScene} />,
		];
	}
	
	/* Switch scene to next */
	switchScene(): void {
		this.setState({ activeScene: this.state.activeScene + 1 });
	}

	render() {
		return (
			<div className="container">
				{this.scenes[this.state.activeScene]}
			</div>
		);
	}
}

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

export default withRouter(App);
