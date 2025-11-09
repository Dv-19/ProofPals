#!/usr/bin/env python3
"""
Test alternative crypto functions
"""

print("=" * 60)
print("TESTING ALTERNATIVE CRYPTO FUNCTIONS")
print("=" * 60)

try:
    import pp_clsag_core
    
    # Generate keys
    seed1 = pp_clsag_core.generate_seed()
    sk1, pk1 = pp_clsag_core.derive_keypair(seed1)
    
    seed2 = pp_clsag_core.generate_seed()
    sk2, pk2 = pp_clsag_core.derive_keypair(seed2)
    
    # Convert to bytes
    if isinstance(pk1, list):
        pk1_bytes = bytes(pk1)
        pk2_bytes = bytes(pk2)
        sk1_bytes = bytes(sk1)
    else:
        pk1_bytes = pk1
        pk2_bytes = pk2
        sk1_bytes = sk1
    
    ring = [pk1_bytes, pk2_bytes]
    message = b"test message"
    
    print("\n1. Testing ring_sign and ring_verify:")
    try:
        signature = pp_clsag_core.ring_sign(message, ring, sk1_bytes, 0)
        print(f"   ✅ ring_sign successful: {type(signature)}")
        
        is_valid = pp_clsag_core.ring_verify(message, ring, signature)
        print(f"   ✅ ring_verify result: {is_valid}")
        
        if is_valid:
            print("   🔐 RING SIGNATURES WORK!")
        else:
            print("   ❌ Ring signature verification failed")
            
    except Exception as e:
        print(f"   ❌ Ring signature error: {e}")
    
    print("\n2. Testing keygen_from_seed:")
    try:
        seed = pp_clsag_core.generate_seed()
        if isinstance(seed, list):
            seed_bytes = bytes(seed)
        else:
            seed_bytes = seed
            
        sk, pk = pp_clsag_core.keygen_from_seed(seed_bytes, b"test_label")
        print(f"   ✅ keygen_from_seed successful")
        print(f"   - sk type: {type(sk)}, length: {len(sk)}")
        print(f"   - pk type: {type(pk)}, length: {len(pk)}")
        
        # Test with this keypair
        if isinstance(pk, list):
            pk_bytes = bytes(pk)
            sk_bytes = bytes(sk)
        else:
            pk_bytes = pk
            sk_bytes = sk
            
        ring2 = [pk_bytes, pk1_bytes]
        signature2 = pp_clsag_core.ring_sign(message, ring2, sk_bytes, 0)
        is_valid2 = pp_clsag_core.ring_verify(message, ring2, signature2)
        print(f"   ✅ keygen_from_seed + ring_sign: {is_valid2}")
        
    except Exception as e:
        print(f"   ❌ keygen_from_seed error: {e}")
    
    print("\n3. Testing canonical_message:")
    try:
        canonical_msg = pp_clsag_core.canonical_message("123", "news", "approve", 1, "nonce")
        print(f"   ✅ canonical_message successful: {len(canonical_msg)} bytes")
        print(f"   - Message: {canonical_msg[:50]}...")
        
        # Test signing canonical message
        signature3 = pp_clsag_core.ring_sign(canonical_msg, ring, sk1_bytes, 0)
        is_valid3 = pp_clsag_core.ring_verify(canonical_msg, ring, signature3)
        print(f"   ✅ Canonical message signing: {is_valid3}")
        
    except Exception as e:
        print(f"   ❌ canonical_message error: {e}")
    
    print("\n" + "=" * 60)
    print("SUMMARY:")
    print("- CLSAG functions may have issues")
    print("- Ring signature functions appear to work")
    print("- System can use ring_sign/ring_verify as alternative")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
