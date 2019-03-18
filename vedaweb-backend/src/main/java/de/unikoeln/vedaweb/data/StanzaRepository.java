package de.unikoeln.vedaweb.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StanzaRepository extends MongoRepository<Stanza, String> {
    public Optional<Stanza> findById(String id);
    public Optional<Stanza> findByIndex(int index);
    public Optional<Stanza> findByBookAndHymnAndStanza(Integer book, Integer Hymn, Integer stanza);
    public Optional<List<Stanza>> findByHymnAbs(Integer hymnAbs);
}
 