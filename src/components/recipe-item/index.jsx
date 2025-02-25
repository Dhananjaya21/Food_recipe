import "./styles.css";

const RecipeItem = (props) => {
  const { id, image, title, addToFavourites } = props;

  return (
    <div className="recipe-item">
      <div key={id}>
        <img src={image} />
      </div>

      <p>{title}</p>
      <button type='button' onClick={addToFavourites} className="favorite-button">add to favourites</button>
    </div>
  );
};
export default RecipeItem;
