package com.soa.vaccinemanagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {
    public User(String userName, String password, String token) {
		super();
		this.userName = userName;
		this.password = password;
		this.token = token;
	}

	public User(Integer idUser, String userName, String password, String token) {
		super();
		this.idUser = idUser;
		this.userName = userName;
		this.password = password;
		this.token = token;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUser;

    @Column(unique = true, nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;

    private String token;
    
    public User() {
		// TODO Auto-generated constructor stub
	}

	public Integer getIdUser() {
		return idUser;
	}

	public void setIdUser(Integer idUser) {
		this.idUser = idUser;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
    
    
}