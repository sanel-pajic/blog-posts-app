import React from "react";
import { InputBlogComponent } from "../components/InputBlogComponent";

export const Home: React.FC = () => {
  return (
    <div>
      <hr style={{ position: "relative", bottom: 10 }}></hr>
      <div style={{}}>
        HOME COMPONENT
        <InputBlogComponent />
      </div>
    </div>
  );
};
