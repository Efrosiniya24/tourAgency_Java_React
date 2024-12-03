package com.tourAgency.tourAgencyJava.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Slf4j
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/tourAgency/auth/authenticate",
                                "/tourAgency/auth/signUp",
                                "/tourAgency/tours/allTours",
                                "/tourAgency/tours/some-endpoint",
                                "/tourAgency/tours/search",
                                "/tourAgency/admin/currentUser",
                                "/tourAgency/orders/getOrders/**",
                                "/tourAgency/photo/getPhoto/**",
                                "/tourAgency/photo/getFirstPhoto/**",
                                "/tourAgency/tours/sortCostCheap",
                                "/tourAgency/tours/sortCostExpensive",
                                "/tourAgency/tours/countTours",
                                "/tourAgency/tours/tour/**",
                                "/tourAgency/auth/logout")
                        .permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/tourAgency/tours/deleteTour/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/tourAgency/tours/addTour").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/tourAgency/orders/addOrder").hasAuthority("USER")
                        .requestMatchers(HttpMethod.PUT, "/tourAgency/tours/updateTour/**", "/tourAgency/orders/updateStatus/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/tourAgency/admin/allUsers", "/tourAgency/admin/searchUser",
                                "/tourAgency/orders/getOrders", "/tourAgency/orders/quantityOfAllOrders",
                                "/tourAgency/orders/quantityOfFemaleOrders", "/tourAgency/orders/quantityOfMaleOrdes").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "tourAgency/admin/getUserData").authenticated()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
