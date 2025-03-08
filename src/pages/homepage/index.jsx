import { useCallback, useEffect, useReducer, useState } from "react";
import Search from "../../components/search";
import "./styles.css";
import RecipeItem from "../../components/recipe-item";
import FavouritesItem from "../../components/favourites-item";

const reducer = (state, action) => {
  switch (action.type) {
    case "filterFavourites":
      console.log(action);
      return {
        ...state,
        filteredValue: action.value,
      };
    // return state;

    default:
      return state;
  }
};

const initialState = {
  filteredValue: "",
};
const Homepage = () => {
  const [loadingState, setLoadingState] = useState(false);
  //save receipes received from api
  const [recipes, setRecipes] = useState([]);
  //favourites data state
  const [favourites, setFavourites] = useState([]);
  const [apiCalledSuccess, setApiCalledSuccess] = useState(false);
  const [filteredState, dispatch] = useReducer(reducer, initialState);

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

  const addToFavourites = useCallback(
    (getCurrentRecepeItem) => {
      let copyFavourites = [...(favourites || [])]; // Ensure it's always an array
      const index = copyFavourites.findIndex(
        (item) => item.id === getCurrentRecepeItem.id
      );
      if (index === -1) {
        copyFavourites.push(getCurrentRecepeItem);
        setFavourites(copyFavourites);
        //save in local storage
        localStorage.setItem("favourites", JSON.stringify(copyFavourites));
        window.scrollTo({ top: "0", behavior: "smooth" });
      } else {
        alert("already in favourites");
      }
    },
    [favourites]
  );

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

  const filteredFavouritesItem = favourites.filter((item) =>
    item.title.toLowerCase().includes(filteredState.filteredValue)
  );

  const renderRecipes = useCallback(() => {
    if (recipes && recipes.length > 0) {
      return recipes.map((item) => (
        <RecipeItem
          addToFavourites={() => addToFavourites(item)}
          id={item.id}
          image={item.image}
          title={item.title}
        />
      ));
    } else {
      return null;
    }
  }, [recipes, addToFavourites]);

  console.log(filteredState, "filteredState");

  return (
    <div className="App-header">
      <Search
        getDataFromSearchComponent={getDataFromSearchComponent}
        apiCalledSuccess={apiCalledSuccess}
        setApiCalledSuccess={setApiCalledSuccess}
        dispatch={dispatch}
      />
      
        <div className="favourites-wrapper">
          <h2 className="section-title">Favourites</h2>

          <div className="search-favourites">
            <input
              onChange={(event) =>
                dispatch({
                  type: "filterFavourites",
                  value: event.target.value,
                })
              }
              value={filteredState.filteredValue}
              name="searchfavourites"
              className="search-box"
              placeholder="Search favourites..."
            />
          </div>

          <div className="favourites">
            {filteredFavouritesItem && filteredFavouritesItem.length > 0 ? (
              filteredFavouritesItem.map((item) => (
                <FavouritesItem
                  removeFromFavourites={() => removeFromFavourites(item)}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                />
              ))
            ) : (
              <p className="empty-message">No favourites added yet.</p>
            )}
          </div>
        </div>
      

      {loadingState && <div className="loading">Loading...</div>}

      <div className="items">{renderRecipes()}</div>
    </div>
  );
};

export default Homepage;
