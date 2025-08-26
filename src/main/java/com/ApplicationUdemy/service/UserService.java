package com.ApplicationUdemy.service;

import com.ApplicationUdemy.dtos.AddressDto;
import com.ApplicationUdemy.dtos.request.UserRequest;
import com.ApplicationUdemy.dtos.response.UserResponse;
import com.ApplicationUdemy.models.Address;
import com.ApplicationUdemy.models.User;
import com.ApplicationUdemy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> fetchAllUsers() {
        List<User> userList=userRepository.findAll();
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public Optional<UserResponse> fetchUser(Long id) {
        return userRepository.findById(id)
                .map(this::mapToUserResponse);
    }

    public void addUser(UserRequest userRequest) {
        User user=new User();
        updateUserFromRequest(user,userRequest);
        userRepository.save(user);
    }

    private void updateUserFromRequest(User user, UserRequest userRequest) {
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
     //   user.setRole(userRequest.getRole());

        if (userRequest.getAddress() != null){
            Address address = new Address();
            address.setStreet(userRequest.getAddress().getStreet());
            address.setState(userRequest.getAddress().getState());
            address.setCity(userRequest.getAddress().getCity());
            address.setCountry(userRequest.getAddress().getCountry());
            address.setZipCode(userRequest.getAddress().getZipCode());
            user.setAddress(address);
        }
    }


    public boolean updateUser(Long id, UserRequest updateUserRequest) {
       return userRepository.findById(id).map(existingUser->{
                 updateUserFromRequest(existingUser,updateUserRequest);
                 userRepository.save(existingUser);
                 return  true;
               }

       ).orElse(false);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    private UserResponse mapToUserResponse(User user){
        UserResponse response=new UserResponse();
        response.setId(String.valueOf(user.getId()));
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
       // response.setAddressDto(user.getAddress());
        if(user.getAddress()!=null){
            AddressDto addressDto=new AddressDto();
            addressDto.setStreet(user.getAddress().getStreet());
            addressDto.setCity(user.getAddress().getCity());
            addressDto.setCountry(user.getAddress().getCountry());
            addressDto.setState(user.getAddress().getState());
            addressDto.setZipCode(user.getAddress().getZipCode());
            response.setAddress(addressDto);
        }
        return  response;
    }
}
