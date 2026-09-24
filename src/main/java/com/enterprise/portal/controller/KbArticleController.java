package com.enterprise.portal.controller;

import com.enterprise.portal.dto.ApiResponse;
import com.enterprise.portal.model.KbArticle;
import com.enterprise.portal.service.KbArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kb")
@CrossOrigin(origins = "*")
public class KbArticleController {

    private final KbArticleService kbArticleService;

    public KbArticleController(KbArticleService kbArticleService) {
        this.kbArticleService = kbArticleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<KbArticle>>> getAllArticles() {
        return ResponseEntity.ok(ApiResponse.success(kbArticleService.getAllArticles()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<KbArticle>>> searchArticles(@RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(kbArticleService.searchArticles(query)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KbArticle>> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(kbArticleService.getArticleById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KbArticle>> createArticle(@RequestBody KbArticle article) {
        return ResponseEntity.ok(ApiResponse.success("Article created", kbArticleService.createArticle(article)));
    }

    @PostMapping("/{id}/deflection")
    public ResponseEntity<ApiResponse<String>> recordDeflection(@PathVariable Long id) {
        kbArticleService.incrementDeflection(id);
        return ResponseEntity.ok(ApiResponse.success("Deflection recorded", "OK"));
    }
}
