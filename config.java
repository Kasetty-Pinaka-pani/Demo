@Configuration
public class SecurityConfig {

  @Bean
  @Order(1)
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
    http.getConfigurer(OAuth2AuthorizationServerConfigurer.class).oidc(Customizer.withDefaults());
    http.exceptionHandling(
            e -> e.authenticationEntryPoint(
                    new LoginUrlAuthenticationEntryPoint("/login")
            ));
    return http.build();
  }

  @Bean
  @Order(2)
  public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    http.formLogin(Customizer.withDefaults());
    http.authorizeHttpRequests(a -> a.anyRequest().authenticated());
    return http.build();
  }
}

@Configuration
public class AppConfig {
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	  public RegisteredClientRepository registeredClientRepository() {
	    RegisteredClient registeredClient = RegisteredClient.withId(String.valueOf(UUID.randomUUID()))
	            .clientId("client")
	            .clientSecret("{bcrypt}" + new BCryptPasswordEncoder().encode("secret"))
	            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
	            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
	            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
	            .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
	            .redirectUri("http://localhost:8085/login/oauth2/code/client")
	            .scope("read")
	            .scope("write")
	            .tokenSettings(
	                TokenSettings.builder()
	                    .accessTokenTimeToLive(Duration.ofHours(6))
	                    .build()
	            )
	            .clientSettings(
	                ClientSettings.builder()
	                    .requireProofKey(false)
	                    .build()
	            )
	            .build();
	    return new InMemoryRegisteredClientRepository(registeredClient);
	  }

  @Bean
  public AuthorizationServerSettings authorizationServerSettings() {
    return  AuthorizationServerSettings.builder().build();
  }

  @Bean
  public JWKSource<SecurityContext> jwkSource() throws NoSuchAlgorithmException {
    KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
    generator.initialize(2048);
    KeyPair keyPair = generator.generateKeyPair();

    RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
    RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

    RSAKey rsaKey = new RSAKey.Builder(publicKey)
            .privateKey(privateKey)
            .keyID(String.valueOf(UUID.randomUUID()))
            .build();
    return new ImmutableJWKSet<>(new JWKSet(rsaKey));
  }
}
