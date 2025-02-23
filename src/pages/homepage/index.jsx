import { useEffect, useReducer, useState } from "react";
import Search from "../../components/search";
import "./styles.css";
import RecipeItem from "../../components/recipe-item";
import FavouritesItem from "../../components/favourites-item";

const reducer = (state, action) => {
  switch (action.type) {
    case 'filterFavourites':
      return state;

    default:
      return state;
  }
};

const initState = {
  filteredValue: '',
};
const Homepage = () => {
  const [loadingState, setLoadingState] = useState(false);
  //save receipes received from api
  const [recipes, setRecipes] = useState([]);
  //favourites data state
  const [favourites, setFavourites] = useState([]);
  const [apiCalledSuccess, setApiCalledSuccess] = useState(false);
  const [filteredState, dispatch] = useReducer(reducer, initState);

  const getDataFromSearchComponent = (data) => {
    async function getRecepies() {
      setLoadingState(true);
      const apiResponse = await fetch(
        "https://api.spoonacular.com/recipes/complexSearch?apiKey=7a538c82274b4649b1bda41a4ea16c60&query=" +
          data
      );
      const result = await apiResponse.json();
      const { results } = result;

      if (results && results.length > 0) {
        setLoadingState(false);
        setRecipes(results);
        setApiCalledSuccess(true);
      }
    }
    getRecepies();
  };

  const addToFavourites = (getCurrentRecepeItem) => {
    let copyFavourites = [...(favourites || [])]; // Ensure it's always an array
    const index = copyFavourites.findIndex(
      (item) => item.id === getCurrentRecepeItem.id
    );
    if (index === -1) {
      copyFavourites.push(getCurrentRecepeItem);
      setFavourites(copyFavourites);
      //save in local storage
      localStorage.setItem("favourites", JSON.stringify(copyFavourites));
    } else {
      alert("already in favourites");
    }
  };

  const removeFromFavourites = (getCurrentRecepeItem) => {
    let copyFavourites = [...(favourites || [])]; // Ensure it's always an array
    copyFavourites = copyFavourites.filter(
      (item) => item.id !== getCurrentRecepeItem.id
    );

    setFavourites(copyFavourites);
    localStorage.setItem("favourites", JSON.stringify(copyFavourites));
  };

  useEffect(() => {
    const extractFavouritesFromLocalStorageOnPageLoad = JSON.parse(
      localStorage.getItem("favourites")
    );
    setFavourites(extractFavouritesFromLocalStorageOnPageLoad);
  }, []);

  return (
    <div className="App-header">
      <Search
        getDataFromSearchComponent={getDataFromSearchComponent}
        apiCalledSuccess={apiCalledSuccess}
        setApiCalledSuccess={setApiCalledSuccess}
      />
      <div className="favourites-wrapper">
        <h1 className="favourites-title">Favourites</h1>
        <div className="search-favourites">
          <input onchange={(event)=> dispatch({type : 'filterFavourites', value: event.target.value })} 
          name="searchfavourites" placeholder="Search Favourites" />
        </div>
        <div className="favourites">
          {favourites && favourites.length > 0
            ? favourites.map((item) => (
                <FavouritesItem
                  removeFromFavourites={() => removeFromFavourites(item)}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                />
              ))
            : null}
        </div>
      </div>
      {loadingState && <div>loading</div>}
      <div className="items">
        {recipes && recipes.length > 0
          ? recipes.map((item) => (
              <RecipeItem
                addToFavourites={() => addToFavourites(item)}
                id={item.id}
                image={item.image}
                title={item.title}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Homepage;
