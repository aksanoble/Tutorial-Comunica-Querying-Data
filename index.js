const express = require('express');
const newEngine = require('@comunica/actor-init-sparql').newEngine;

const app = express();
const port = 3000;
const engine = newEngine();

const query = `
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?name
{ 
    ?person dbpedia-owl:birthPlace <http://dbpedia.org/resource/Belgium>;
            foaf:name ?name.
}
`;
const sources = [
    { type: 'hypermedia', value: 'http://fragments.dbpedia.org/2016-04/en' }
];

app.get('/', (req, res) => {
    engine.query(query, { sources: sources }).then(result => {
        res.set('content-type', 'text/plain; charset=utf-8');

        result.bindingsStream.on('data', data => res.write(data.get('?name').value + '\n'));
        result.bindingsStream.on('end', () => res.end());
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
