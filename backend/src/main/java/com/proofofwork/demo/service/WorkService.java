package com.proofofwork.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.proofofwork.demo.entity.Work;
import com.proofofwork.demo.repository.WorkRepository;

@Service
public class WorkService {

    private final WorkRepository workRepository;

    public WorkService(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    public List<Work> getAllWorks() {
        return workRepository.findAll();
    }

    public Optional<Work> getWorkById(Long id) {
        return workRepository.findById(id);
    }

    public Work createWork(Work work) {
        return workRepository.save(work);
    }

    public Work updateWork(Long id, Work work) {

        Work existingWork = workRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work not found"));

        existingWork.setTitle(work.getTitle());
        existingWork.setDescription(work.getDescription());
        existingWork.setLocation(work.getLocation());
        existingWork.setStatus(work.getStatus());

        return workRepository.save(existingWork);
    }

    public void deleteWork(Long id) {
        workRepository.deleteById(id);
    }
}
 