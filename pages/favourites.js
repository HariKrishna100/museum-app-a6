import React from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store.js';
import ArtworkCard from '../components/ArtworkCard';
import { Row ,Col, Card } from "react-bootstrap";

export default function Favourites() {
    const [favouritesList] = useAtom(favouritesAtom);
    if (!favouritesList) return null;
    if (favouritesList) {
        return (
            <><Row className="gy-4">
                {favouritesList.length > 0 ?(favouritesList.map((favouritesList) => {
                    return (<Col lg={3} key={favouritesList}><ArtworkCard objectID={favouritesList} /></Col>);
                })
            ):(
                <Card>
                    <Card.Body>
                        <Card.Title>Nothing Here</Card.Title>
                        <Card.Text>Try adding some new artwork to the list.</Card.Text>
                    </Card.Body>
                </Card>
            )}
            </Row>
            {!favouritesList && null}</>
        );
    }
}