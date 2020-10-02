package de.unikoeln.vedaweb.document;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * 
 * DB repository for XML sources of stanza documents
 * 
 * @author bkis
 *
 */
public interface StanzaXmlRepository extends MongoRepository<StanzaXml, String> {
    public Optional<StanzaXml> findById(String id);
}
 