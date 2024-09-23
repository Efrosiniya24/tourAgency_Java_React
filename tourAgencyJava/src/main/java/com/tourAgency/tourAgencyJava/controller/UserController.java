package com.tourAgency.tourAgencyJava.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("tourAgency/user")
@Slf4j
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class UserController {


}
