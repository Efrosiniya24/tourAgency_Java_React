package com.tourAgency.tourAgencyJava.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tourAgency.tourAgencyJava.model.Enum.Role;
import com.tourAgency.tourAgencyJava.service.EncryptionService;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;
@Entity
@Table(name = "users")
@Data
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Transient
    @JsonIgnore
    private EncryptionService encryptionService;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "patronymic")
    private String patronymic;

    @Column(name = "active")
    private boolean active;

    @Column(name = "password")
    private String password;

    @Column(name = "gender_client")
    private String genderClient;

    @Column(name = "age")
    private int age;

    @Column(name = "birthday")
    private Date dateOfBirth;

    @Transient
    private transient EncryptionService hashingService;

    @Column(name = "passport_series")
    private String passportSeries;

    @Column(name = "passport_number")
    private String passportNumber;

    @Enumerated(EnumType.STRING)
//    @NotNull
    private Role role;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

//    @JsonIgnore
//    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
//    private List<Order> ordersManager;

    @PrePersist
    @PreUpdate
    private void encryptSensitiveData() throws Exception {
        if (passportSeries != null && encryptionService != null) {
            this.passportSeries = encryptionService.encrypt(passportSeries);
        }
        if (passportNumber != null && encryptionService != null) {
            this.passportNumber = encryptionService.encrypt(passportNumber);
        }
    }

    @PostLoad
    private void decryptSensitiveData() throws Exception {
        if (passportSeries != null && encryptionService != null) {
            this.passportSeries = encryptionService.decrypt(passportSeries);
        }
        if (passportNumber != null && encryptionService != null) {
            this.passportNumber = encryptionService.decrypt(passportNumber);
        }
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


    public void setEncryptionService(EncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }
}
