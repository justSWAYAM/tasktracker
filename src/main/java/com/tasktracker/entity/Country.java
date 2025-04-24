package com.tasktracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "countries")
@Data
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Country name is required")
    @Column(name = "country_name", unique = true)
    private String countryName;

    @NotNull(message = "Population is required")
    private Long population;

    @NotBlank(message = "Religion is required")
    private String religion;

    @Column(name = "football_ranking")
    private Integer footballRanking;

    @Column(name = "cricket_ranking")
    private Integer cricketRanking;
} 