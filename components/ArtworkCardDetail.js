import { Button, Card } from "react-bootstrap";
import useSWR from "swr";
import Error from "next/error";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store.js";
import { addToFavourites, removeFromFavourites } from "../lib/userData";

export default function ArtworkCardDetail(props) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  const { data, error } = useSWR(
    props.objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`
      : null
  );

  useEffect(() => {
    setShowAdded(favouritesList?.includes(props.objectID));
  }, [favouritesList]);

  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(props.objectID));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(props.objectID));
      setShowAdded(true);
    }
  }

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Card>
        {data.primaryImage && (
          <Card.Img variant="top" src={data.primaryImage} />
        )}
        <Card.Body>
          <Card.Title>{data.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {data.objectDate || "N/A"}
            <br />
            <strong>Classification:</strong> {data.classification || "N/A"}
            <br />
            <strong>Medium:</strong> {data.medium || "N/A"}
            <br /><br />
            <strong>Artist:</strong> {data.artistDisplayName || "N/A"}
            &nbsp;(&nbsp;
            {data.artistDisplayName && (
              <a
                href={data.artistWikidata_URL}
                target="_blank"
                rel="noreferrer"
              >
                wiki
              </a>
            )}
            &nbsp;)
            <br />
            <strong>Credit Line:</strong> {data.creditLine || "N/A"}
            <br />
            <strong>Dimensions:</strong> {data.dimensions || "N/A"}
            <br /><br />
            <Button
              variant={showAdded ? "primary" : "outline-primary"}
              onClick={(e) => favouritesClicked()}
            >
              {showAdded ? "+ Favourite ( added )" : "+ Favourite"}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
