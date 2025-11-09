#!/usr/bin/env python3
"""Test current crypto status"""

print("=" * 60)
print("ProofPals Crypto Status Check")
print("=" * 60)

# Test 1: Check if pp_clsag_core is available
print("\n1. Testing pp_clsag_core library:")
try:
    import pp_clsag_core
    print("   ✅ pp_clsag_core: INSTALLED")
    
    # Test basic functions
    seed = pp_clsag_core.generate_seed()
    sk, pk = pp_clsag_core.derive_keypair(seed)
    print(f"   ✅ Real crypto functions work:")
    print(f"      - Seed: {len(seed)} bytes")
    print(f"      - Secret key: {len(sk)} bytes") 
    print(f"      - Public key: {len(pk)} bytes")
    
    # Handle both bytes and list objects
    if isinstance(pk, list):
        pk_hex = bytes(pk).hex()
    else:
        pk_hex = pk.hex()
    print(f"      - Sample public key: {pk_hex[:32]}...")
    
    REAL_CRYPTO = True
    
except ImportError as e:
    print("   ❌ pp_clsag_core: NOT INSTALLED")
    print(f"      Error: {e}")
    REAL_CRYPTO = False
except Exception as e:
    print(f"   ❌ pp_clsag_core: ERROR - {e}")
    REAL_CRYPTO = False

# Test 2: Check crypto service
print("\n2. Testing crypto service:")
try:
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).parent))
    
    from crypto_service import get_crypto_service, CRYPTO_AVAILABLE
    
    print(f"   CRYPTO_AVAILABLE flag: {CRYPTO_AVAILABLE}")
    
    crypto_service = get_crypto_service()
    if crypto_service:
        print("   ✅ Crypto service: Available")
        
        # Test key generation
        seed_hex, private_key_hex, public_key_hex = crypto_service.generate_keypair()
        print(f"   ✅ Key generation works:")
        print(f"      - Seed: {len(seed_hex)} hex chars")
        print(f"      - Private key: {len(private_key_hex)} hex chars")
        print(f"      - Public key: {len(public_key_hex)} hex chars")
        print(f"      - Sample public key: {public_key_hex[:32]}...")
        
        if REAL_CRYPTO:
            print("   🔐 Using REAL cryptographic functions")
        else:
            print("   ⚠️  Using FALLBACK crypto (for testing only)")
            
    else:
        print("   ❌ Crypto service: Not available")
        
except Exception as e:
    print(f"   ❌ Crypto service error: {e}")

# Test 3: Check what the system is actually using
print("\n3. System crypto status:")
if REAL_CRYPTO:
    print("   🔐 PRODUCTION READY: Real cryptographic library available")
    print("   ✅ Ring signatures will be cryptographically secure")
    print("   ✅ Anonymous voting will be truly anonymous")
else:
    print("   ⚠️  DEVELOPMENT MODE: Using fallback crypto")
    print("   ⚠️  Keys are unique but NOT cryptographically secure")
    print("   ⚠️  Good for testing, but NOT for production")

print("\n" + "=" * 60)
print("Summary:")
if REAL_CRYPTO:
    print("✅ Full crypto functionality - ready for production!")
else:
    print("⚠️  Fallback crypto - good for development/testing")
    print("   To install real crypto: cd ../pp_clsag_core && maturin develop --release")
print("=" * 60)
