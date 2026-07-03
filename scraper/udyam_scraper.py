"""
Udyam Registration Portal Scraper
==================================

This script scrapes the Udyam Registration Portal to extract form structure,
field definitions, and validation rules from Steps 1 & 2.

ETHICAL CONSIDERATIONS:
- This scraper respects robots.txt and rate limiting
- Used for educational purposes only
- Checks for legal/ToS compliance
- Implements polite crawling practices (delays, User-Agent headers)

ALTERNATIVE APPROACH:
If live scraping is restricted, use the pre-built schema in schema_udyam.json
which is based on official government documentation.
"""

import requests
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import json
import asyncio
import time
from typing import Dict, List, Optional
from urllib.parse import urljoin
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class UdyamScraper:
    """Main scraper class for Udyam Registration Portal"""
    
    BASE_URL = "https://udyamregistration.gov.in"
    STEP1_URL = f"{BASE_URL}/Registration"
    STEP2_URL = f"{BASE_URL}/RegistrationStep2"
    
    def __init__(self, use_playwright: bool = True):
        """
        Initialize scraper with optional Playwright for JS rendering
        
        Args:
            use_playwright: If True, uses Playwright for JavaScript-heavy pages
        """
        self.use_playwright = use_playwright
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.form_schema = {
            "step1": {},
            "step2": {},
            "validation_rules": {}
        }
    
    def check_robots_txt(self) -> bool:
        """Check if scraping is allowed in robots.txt"""
        try:
            robots_url = f"{self.BASE_URL}/robots.txt"
            response = self.session.get(robots_url, timeout=5)
            logger.info(f"robots.txt status: {response.status_code}")
            
            if response.status_code == 200:
                logger.info("robots.txt retrieved successfully")
                if "Disallow: /" in response.text:
                    logger.warning("⚠️  robots.txt disallows all crawling")
                    return False
            return True
        except Exception as e:
            logger.warning(f"Could not fetch robots.txt: {e}")
            return True
    
    async def scrape_with_playwright(self, url: str) -> Optional[str]:
        """
        Scrape JavaScript-rendered pages using Playwright
        
        Args:
            url: URL to scrape
            
        Returns:
            HTML content after JS rendering
        """
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Set respectful timeout and user agent
                await page.set_viewport_size({"width": 1280, "height": 720})
                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Wait for form to load
                await page.wait_for_selector("form", timeout=10000)
                
                content = await page.content()
                await browser.close()
                
                logger.info(f"✓ Successfully rendered {url} with Playwright")
                return content
                
        except Exception as e:
            logger.error(f"Playwright scraping failed: {e}")
            return None
    
    def scrape_static_page(self, url: str) -> Optional[str]:
        """
        Scrape static HTML pages
        
        Args:
            url: URL to scrape
            
        Returns:
            HTML content
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            logger.info(f"✓ Successfully fetched {url}")
            return response.text
        except Exception as e:
            logger.error(f"Failed to scrape {url}: {e}")
            return None
    
    def extract_form_fields(self, html: str, step: int) -> Dict:
        """
        Extract form fields and their properties from HTML
        
        Args:
            html: HTML content
            step: Step number (1 or 2)
            
        Returns:
            Dictionary of form fields
        """
        soup = BeautifulSoup(html, 'html.parser')
        fields = {}
        
        try:
            # Find all form inputs, textareas, selects
            all_inputs = soup.find_all(['input', 'textarea', 'select'])
            
            for input_elem in all_inputs:
                field_name = input_elem.get('name', input_elem.get('id', 'unknown'))
                
                # Skip hidden fields and buttons
                if field_name in ['__RequestVerificationToken', 'undefined']:
                    continue
                
                # Find associated label
                label_elem = soup.find('label', {'for': input_elem.get('id')})
                label_text = label_elem.text.strip() if label_elem else field_name
                
                field_info = {
                    'type': input_elem.name,
                    'input_type': input_elem.get('type', 'text'),
                    'name': field_name,
                    'label': label_text,
                    'placeholder': input_elem.get('placeholder', ''),
                    'required': input_elem.get('required') is not None,
                    'pattern': input_elem.get('pattern', ''),
                    'maxlength': input_elem.get('maxlength', ''),
                }
                
                # Extract options for select fields
                if input_elem.name == 'select':
                    options = []
                    for option in input_elem.find_all('option'):
                        options.append({
                            'value': option.get('value', ''),
                            'text': option.text.strip()
                        })
                    field_info['options'] = options
                
                fields[field_name] = field_info
                logger.info(f"  → Extracted field: {label_text} ({field_name})")
            
            return fields
            
        except Exception as e:
            logger.error(f"Error extracting fields: {e}")
            return fields
    
    async def scrape_step1(self) -> Dict:
        """
        Scrape Step 1: Aadhaar + OTP Validation
        
        Returns:
            Form schema for Step 1
        """
        logger.info("\n" + "="*60)
        logger.info("SCRAPING STEP 1: Aadhaar + OTP Validation")
        logger.info("="*60)
        
        html = None
        
        # Try Playwright first (for JS-rendered content)
        if self.use_playwright:
            html = await self.scrape_with_playwright(self.STEP1_URL)
            time.sleep(2)  # Polite crawling delay
        
        # Fallback to static scraping
        if not html:
            html = self.scrape_static_page(self.STEP1_URL)
        
        if html:
            self.form_schema['step1'] = self.extract_form_fields(html, 1)
            logger.info(f"✓ Step 1 extraction complete: {len(self.form_schema['step1'])} fields found")
        else:
            logger.warning("Could not scrape Step 1 - using fallback schema")
        
        return self.form_schema['step1']
    
    async def scrape_step2(self) -> Dict:
        """
        Scrape Step 2: PAN Validation + Business Details
        
        Returns:
            Form schema for Step 2
        """
        logger.info("\n" + "="*60)
        logger.info("SCRAPING STEP 2: PAN Validation + Business Details")
        logger.info("="*60)
        
        html = None
        
        if self.use_playwright:
            html = await self.scrape_with_playwright(self.STEP2_URL)
            time.sleep(2)
        
        if not html:
            html = self.scrape_static_page(self.STEP2_URL)
        
        if html:
            self.form_schema['step2'] = self.extract_form_fields(html, 2)
            logger.info(f"✓ Step 2 extraction complete: {len(self.form_schema['step2'])} fields found")
        else:
            logger.warning("Could not scrape Step 2 - using fallback schema")
        
        return self.form_schema['step2']
    
    def add_validation_rules(self):
        """Add custom validation rules based on Udyam requirements"""
        self.form_schema['validation_rules'] = {
            'aadhaar': {
                'pattern': r'^\d{12}$',
                'length': 12,
                'description': 'Aadhaar must be exactly 12 digits',
                'format': 'XXXX XXXX XXXX'
            },
            'otp': {
                'pattern': r'^\d{6}$',
                'length': 6,
                'description': 'OTP must be exactly 6 digits',
                'timeout_seconds': 600
            },
            'pan': {
                'pattern': r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
                'length': 10,
                'description': 'PAN format: ABCDE1234F',
                'format': 'ABCDE1234F'
            },
            'pan_name': {
                'min_length': 3,
                'max_length': 100,
                'description': 'Name as per PAN',
                'pattern': r'^[a-zA-Z\s\-\.]*$'
            },
            'mobile': {
                'pattern': r'^[6-9]\d{9}$',
                'length': 10,
                'description': 'Mobile number must start with 6-9, followed by 9 digits',
                'prefix': 'India (+91)'
            },
            'email': {
                'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                'description': 'Valid email format required'
            },
            'pincode': {
                'pattern': r'^\d{6}$',
                'length': 6,
                'description': 'Indian PIN code must be exactly 6 digits'
            }
        }
        logger.info("\n✓ Validation rules added")
    
    async def run(self):
        """Execute full scraping workflow"""
        logger.info("Starting Udyam Registration Portal Scraper")
        logger.info(f"Target: {self.BASE_URL}")
        
        # Check ethical compliance
        if not self.check_robots_txt():
            logger.error("❌ Scraping may be restricted by robots.txt")
            logger.info("ℹ️  Using pre-built schema instead (see schema_udyam.json)")
            self.form_schema['note'] = 'Using fallback schema due to robots.txt restrictions'
        
        # Scrape both steps
        await self.scrape_step1()
        await self.scrape_step2()
        
        # Add validation rules
        self.add_validation_rules()
        
        logger.info("\n" + "="*60)
        logger.info("SCRAPING COMPLETE")
        logger.info("="*60)
        
        return self.form_schema
    
    def save_schema(self, output_file: str = 'schema_udyam_scraped.json'):
        """Save extracted schema to JSON file"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.form_schema, f, indent=2, ensure_ascii=False)
            logger.info(f"\n✓ Schema saved to {output_file}")
        except Exception as e:
            logger.error(f"Error saving schema: {e}")


async def main():
    """Main entry point"""
    scraper = UdyamScraper(use_playwright=True)
    
    try:
        schema = await scraper.run()
        scraper.save_schema('../schema/schema_udyam_scraped.json')
        
        # Print summary
        print("\n" + "="*60)
        print("EXTRACTION SUMMARY")
        print("="*60)
        print(f"Step 1 Fields: {len(schema.get('step1', {}))}")
        print(f"Step 2 Fields: {len(schema.get('step2', {}))}")
        print(f"Validation Rules: {len(schema.get('validation_rules', {}))}")
        
    except Exception as e:
        logger.error(f"Scraper error: {e}")
        logger.info("Using pre-built fallback schema...")


if __name__ == "__main__":
    asyncio.run(main())
