package com.enterprise.portal.service;

import com.enterprise.portal.model.KbArticle;
import com.enterprise.portal.repository.KbArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KbArticleService {

    private final KbArticleRepository kbArticleRepository;

    public KbArticleService(KbArticleRepository kbArticleRepository) {
        this.kbArticleRepository = kbArticleRepository;
    }

    public List<KbArticle> getAllArticles() {
        return kbArticleRepository.findAll();
    }

    public List<KbArticle> searchArticles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllArticles();
        }
        return kbArticleRepository.searchArticles(query.trim());
    }

    public KbArticle getArticleById(Long id) {
        KbArticle article = kbArticleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("KB Article not found with id: " + id));
        article.setViewCount(article.getViewCount() + 1);
        return kbArticleRepository.save(article);
    }

    @Transactional
    public KbArticle createArticle(KbArticle article) {
        return kbArticleRepository.save(article);
    }

    @Transactional
    public void incrementDeflection(Long id) {
        kbArticleRepository.findById(id).ifPresent(article -> {
            article.setDeflectedCount(article.getDeflectedCount() + 1);
            kbArticleRepository.save(article);
        });
    }
}
