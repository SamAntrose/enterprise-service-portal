package com.enterprise.portal.repository;

import com.enterprise.portal.model.KbArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KbArticleRepository extends JpaRepository<KbArticle, Long> {

    List<KbArticle> findByCategory(String category);

    @Query("SELECT k FROM KbArticle k WHERE LOWER(k.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(k.content) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(k.tags) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<KbArticle> searchArticles(@Param("query") String query);

    List<KbArticle> findTop5ByOrderByViewCountDesc();
}
