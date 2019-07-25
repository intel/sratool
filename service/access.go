package main

// Insert Here your routines  to handle Jason Web tokens or other Auth Mechanism
// And return info to main for auth
func authJWT(tokenStr string) bool {

	if tokenStr == "" {
		return false
	}
	displayName = "Anonymous"
	uniId = "00000001"
	return true
}
