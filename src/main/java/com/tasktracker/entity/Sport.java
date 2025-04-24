package com.tasktracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "sports")
@Data
public class Sport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Sport name is required")
    @Column(name = "sport_name", unique = true)
    private String sportName;

    @NotNull(message = "Players count is required")
    @Column(name = "players_count")
    private Integer playersCount;

    @NotBlank(message = "World Cup topper is required")
    @Column(name = "world_cup_topper")
    private String worldCupTopper;

    @Column(name = "ranking")
    private Integer ranking;

    @Column(name = "athletes_count")
    private Integer athletesCount;
} 