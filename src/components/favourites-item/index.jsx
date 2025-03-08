import "./styles.css";

const FavouritesItem = (props) => {
  const { id, image, title, removeFromFavourites } = props;

  return (
    <div className="favourite-item">
      <div key={id}>
        <img src={image} alt="test" />
      </div>

      <p>{title}</p>
      <button type='button' onClick={removeFromFavourites} className="favorite-button">remove from<br /> favourites</button>
    </div>
  );
};
export default FavouritesItem;
