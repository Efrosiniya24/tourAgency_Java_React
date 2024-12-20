package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Integer> {
    List<Language> findByLanguageIn(List<String> names);
}
