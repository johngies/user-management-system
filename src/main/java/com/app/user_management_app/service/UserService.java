package com.app.user_management_app.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.user_management_app.dto.CreateUserRequest;
import com.app.user_management_app.dto.UserResponse;
import com.app.user_management_app.dto.UserSummaryResponse;
import com.app.user_management_app.entity.Address;
import com.app.user_management_app.entity.User;
import com.app.user_management_app.exception.ResourceNotFoundException;
import com.app.user_management_app.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
        .map(this::mapToSummaryResponse)
        .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToUserResponse(user);
    }

    public UserResponse createUser(CreateUserRequest request) {
        Address address = new Address();
        address.setHomeAddress(request.homeAddress());
        address.setWorkAddress(request.workAddress());

        User user = new User();
        user.setName(request.name());
        user.setSurname(request.surname());
        user.setGender(request.gender());
        user.setBirthdate(request.birthdate());
        user.setAddress(address);

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

    // Mappers
    private UserSummaryResponse mapToSummaryResponse(User user) {
        return new UserSummaryResponse(
            user.getId(),
            user.getName(),
            user.getSurname()
        );
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getSurname(),
            user.getGender(),
            user.getBirthdate(),
            user.getAddress() != null ? user.getAddress().getHomeAddress() : null,
            user.getAddress() != null ? user.getAddress().getWorkAddress() : null
        );
    }

}
