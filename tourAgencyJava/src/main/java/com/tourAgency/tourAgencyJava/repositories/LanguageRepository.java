package com.tourAgency.tourAgencyJava.repositories;

import com.tourAgency.tourAgencyJava.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
}
