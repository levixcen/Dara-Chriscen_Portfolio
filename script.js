document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    /**
 Smoothly scrolls to a target section adjusted for the fixed navigation bar height.
@param {string} sectionId - The ID of the target section (e.g., 'home', 'about').
     */

 
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {

            const headerHeight = navbar.offsetHeight; 
            

            const targetPosition = element.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    
    window.addEventListener('scroll', handleScroll);
   
    handleScroll();

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
           
            const targetId = anchor.getAttribute('href').substring(1);
            if (targetId) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });
});