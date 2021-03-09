import { useState, useEffect } from "react";
import yelp from "../api/yelp";

export default () => {
  const [results, setresults] = useState([]);
  const [errMessage, seterrMessage] = useState("");

  const searchApi = async (searchTerm) => {
    try {
      const response = await yelp.get("/search", {
        params: {
          limit: 50,
          term: searchTerm,
          location: "san jose",
        },
      });
      setresults(response.data.businesses);
    } catch (error) {
      seterrMessage("Some thing happened!!");
    }
  };

  useEffect(() => {
    searchApi("pasta");
  }, []);

  return [searchApi, results, errMessage];
};
