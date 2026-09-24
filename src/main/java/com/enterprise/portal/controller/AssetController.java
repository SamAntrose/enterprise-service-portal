package com.enterprise.portal.controller;

import com.enterprise.portal.dto.ApiResponse;
import com.enterprise.portal.model.Asset;
import com.enterprise.portal.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Asset>>> getAllAssets() {
        return ResponseEntity.ok(ApiResponse.success(assetService.getAllAssets()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Asset>> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(assetService.getAssetById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Asset>> saveAsset(@RequestBody Asset asset) {
        return ResponseEntity.ok(ApiResponse.success("Asset saved", assetService.saveAsset(asset)));
    }
}
