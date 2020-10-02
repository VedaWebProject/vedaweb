package de.unikoeln.vedaweb.dictcorrection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * DB repository interface for dictionary corrections
 * 
 * @author bkis
 *
 */
public interface CorrectionsRepository extends MongoRepository<Correction, String>  {
	
	public List<Correction> findAllByCaseId(String caseId);
	public Optional<Correction> findByHeadwordIso(String headwordIso);
	
}
