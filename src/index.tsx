import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Collection from "./scenes/collection/Collection";
import Post from "./scenes/postadd/Post";
import Create from "./scenes/postadd/Create";
import Add from "./scenes/postadd/Add";

/* Router */
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/:location",
		element: <App />,
	},
	{
		path: "/collection/:id",
		element: <Collection />,
	},
	{
		path: "/post",
		element: <Post />,
	},
	{
		path: "/create",
		element: <Create />,
	},
	{
		path: "/add",
		element: <Add />,
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.Fragment>
		<RouterProvider router={router} />
	</React.Fragment>
);
