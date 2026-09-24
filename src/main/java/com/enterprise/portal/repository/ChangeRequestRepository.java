package com.enterprise.portal.repository;

import com.enterprise.portal.model.ChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {

    Optional<ChangeRequest> findByChangeCode(String changeCode);

    List<ChangeRequest> findByStatus(String status);
}
