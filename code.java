@Configuration
public class SecurityConfig {
 
    @Bean
    @Order(1)
    public SecurityFilterChain authorizationSecurityFilterChain(HttpSecurity http) throws Exception {
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
 
        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
            .oidc(Customizer.withDefaults()); // Enable OpenID Connect (if needed)
 
        http.exceptionHandling(e -> e.authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login")))
        .sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        .csrf(AbstractHttpConfigurer::disable);
 
return http.build();
    }
 
    @Bean
    @Order(2)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .formLogin(Customizer.withDefaults()); // Enable form-based login
 
return http.build();
    }
 
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

@Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId("ecommerce-client")
                .clientSecret( new BCryptPasswordEncoder().encode("ecommerce-secret"))
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
//                .authorizationGrantType(AuthorizationGrantType.TOKEN_EXCHANGE)
.redirectUri("http://localhost:8085/login/oauth2/code/ecommerce-client") // Ensure this matches the client
                .scope("read")
                .scope("write")
                .tokenSettings(TokenSettings.builder()
                        .accessTokenTimeToLive(Duration.ofHours(1)) // Set Access Token Expiry
                        .refreshTokenTimeToLive(Duration.ofDays(30)) // Set Refresh Token Expiry
                        .reuseRefreshTokens(false) // Ensure new refresh tokens are issued
                        .build())
                .clientSettings(ClientSettings.builder()
                        .requireAuthorizationConsent(true) // Require user consent
                        .build())
                .build();
 
        return new InMemoryRegisteredClientRepository(registeredClient);
    }
 
    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder().build();
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
                .keyID(UUID.randomUUID().toString())
                .build();
 
        return new ImmutableJWKSet<>(new JWKSet(rsaKey));
    }

spring.security.oauth2.client.registration.ecommerce-client.client-id= ecommerce-client
spring.security.oauth2.client.registration.ecommerce-client.client-secret= ecommerce-secret
spring.security.oauth2.client.registration.ecommerce-client.authorization-grant-type= authorization_code
spring.security.oauth2.client.registration.ecommerce-client.redirect-uri= http://localhost:8085/login/oauth2/code/ecommerce-client
spring.security.oauth2.client.registration.ecommerce-client.scope= read,write

spring.security.oauth2.client.provider.ecommerce-client.authorization-uri= http://localhost:8086/oauth2/authorize
spring.security.oauth2.client.provider.ecommerce-client.token-uri= http://localhost:8086/oauth2/token
spring.security.oauth2.client.provider.ecommerce-client.user-info-uri= http://localhost:8086/userinfo
