package com.app.user_management_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.user_management_app.entity.User;

@Repository 
public interface UserRepository extends JpaRepository<User, Long> {

}
