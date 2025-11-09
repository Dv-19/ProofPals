#!/usr/bin/env python3
"""
Monitor what API calls are being made to help debug frontend issues
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def test_live_api():
    """Test the API while the server is running"""
    
    print("=" * 70)
    print("TESTING LIVE API - ESCALATIONS")
    print("=" * 70)
    
    try:
        import httpx
        
        # Test against the live server (assuming it's running on localhost:8000)
        base_url = "http://localhost:8000"
        
        async with httpx.AsyncClient(base_url=base_url, timeout=10.0) as client:
            
            print("🔍 Testing live server connection...")
            
            # Test health endpoint first
            try:
                health_response = await client.get("/health")
                print(f"   Health check: {health_response.status_code}")
                if health_response.status_code == 200:
                    print("   ✅ Server is running")
                else:
                    print("   ❌ Server health check failed")
                    return
            except Exception as e:
                print(f"   ❌ Cannot connect to server: {e}")
                print("   Make sure the server is running: python main.py")
                return
            
            # Login as admin
            print("\n🔐 Logging in as admin...")
            login_response = await client.post("/api/v1/auth/login", json={
                "username": "Yoman",
                "password": "Yoma1234"
            })
            
            if login_response.status_code != 200:
                print(f"   ❌ Login failed: {login_response.text}")
                return
            
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("   ✅ Admin login successful")
            
            # Test escalations endpoint
            print("\n📋 Testing escalations endpoint...")
            escalation_response = await client.get("/api/v1/admin/escalations", headers=headers)
            
            print(f"   Status: {escalation_response.status_code}")
            
            if escalation_response.status_code == 200:
                data = escalation_response.json()
                print(f"   ✅ API working: {data['count']} escalated submissions")
                
                if data['count'] > 0:
                    print("\n   📄 Escalated submissions:")
                    for sub in data['escalated_submissions']:
                        print(f"      - ID {sub['id']}: {sub['genre']}")
                        print(f"        Status: {sub['status']}")
                        print(f"        Content: {sub['content_ref'][:60]}...")
                        print(f"        Created: {sub['created_at']}")
                    
                    print(f"\n   🎯 CONCLUSION: Backend has escalated content!")
                    print(f"   📱 Frontend issue: Check browser network tab")
                    print(f"   🔍 Look for calls to: /api/v1/admin/escalations")
                    print(f"   🔑 Verify Authorization header is sent")
                    
                else:
                    print("   ⚠️  No escalated submissions found")
                    
            else:
                print(f"   ❌ API call failed: {escalation_response.text}")
            
            # Test what frontend might be calling incorrectly
            print(f"\n🔍 Testing common frontend mistakes...")
            
            # Test wrong endpoint
            wrong_endpoint = await client.get("/api/v1/escalations", headers=headers)
            print(f"   /api/v1/escalations: {wrong_endpoint.status_code}")
            
            # Test without auth
            no_auth = await client.get("/api/v1/admin/escalations")
            print(f"   No auth header: {no_auth.status_code} (should be 401)")
            
            print(f"\n" + "=" * 70)
            print("FRONTEND DEBUGGING CHECKLIST:")
            print("=" * 70)
            print("1. Open browser Developer Tools (F12)")
            print("2. Go to Network tab")
            print("3. Refresh the Escalations page")
            print("4. Look for:")
            print("   - GET /api/v1/admin/escalations")
            print("   - Authorization: Bearer <token> header")
            print("   - Response status 200")
            print("5. If missing, check frontend code")
            print("6. If 401 error, check authentication")
            print("7. Clear browser cache and try again")
            print("=" * 70)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_live_api())
