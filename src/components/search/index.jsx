import "./styles.css";
import React, { useEffect, useState } from "react";

function Search(props) {
  const [searchInputValue, setsearchInputValue] = useState("");
  const { getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess } =
    props;

  function getVal(event) {
    const { value } = event.target;
    setsearchInputValue(value);
  }

  const handleClick = (event) => {
    event.preventDefault();
    getDataFromSearchComponent(searchInputValue);
  };

  useEffect(()=>{
    if(apiCalledSuccess){
      setsearchInputValue('')
      setApiCalledSuccess(false)
    }

  },[apiCalledSuccess,setApiCalledSuccess])

  return (
    <div className="topnav">
      <script src="http://localhost:8097"></script>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <a className="active" href="#home">
        Home
      </a>
      <div className="search-container">
        <input
          onChange={getVal}
          value={searchInputValue}
          id="myInput"
          type="text"
          placeholder="Search now"
        ></input>
        <button onClick={handleClick} type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </div>
  );
}

export default Search;
