package com.proofofwork.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proofofwork.demo.entity.Work;
import com.proofofwork.demo.service.WorkService;

@RestController
@RequestMapping("/api/works")
@CrossOrigin(origins = "*")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping
    public List<Work> getAllWorks() {
        return workService.getAllWorks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Work> getWorkById(@PathVariable Long id) {

        return workService.getWorkById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Work createWork(@RequestBody Work work) {
        return workService.createWork(work);
    }

    @PutMapping("/{id}")
    public Work updateWork(
            @PathVariable Long id,
            @RequestBody Work work) {

        return workService.updateWork(id, work);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWork(@PathVariable Long id) {

        workService.deleteWork(id);

        return ResponseEntity.noContent().build();
    }
}