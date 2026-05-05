import React, { useEffect, useState } from 'react'
import { carDetailStyles } from '../assets/dummyStyles'
import servicesData from '../assets/servicesData'
import { toast, ToastContainer } from 'react-toastify'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle, FaClock, FaCreditCard, FaEnvelope, FaGasPump, FaMap, FaMapMarked, FaMapMarkedAlt, FaPhone, FaTachometerAlt, FaTimes, FaTools, FaUser, FaUserFriends, FaWatchmanMonitoring } from 'react-icons/fa'

const ServicesDetails = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // today's date for date inputs
    const [today, setToday] = useState('');
    useEffect(() => {
        setToday(new Date().toISOString().split('T')[0]);
    }, []);

    // get car from router state or fallback to data
    const service =
        location.state?.service ||
        servicesData.find((c) => String(c.id) === id);
    if (!servicesData) return <div className="p-4 text-white">Car not found.</div>;

    // safe transmission label
    const transmissionLabel = servicesData.transmission
        ? servicesData.transmission.toLowerCase()
        : 'standard';

    // carousel
    const [currentImage, setCurrentImage] = useState(0);
    const serviceImages = [service.image, ...(servicesData.images || [])];

    // booking form state
    const initialForm = {
        pickupDate: '',
        pickupState: '',
        pickupLocation: '',
        name: '',
        email: '',
        phone: '',
        pickupTime: ''
    };

    const [formData, setFormData] = useState(initialForm);
    const [activeField, setActiveField] = useState(null);

    //Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((fd) => ({
            ...fd,
            [name]: value,
        }));
    };

    //Calculation Function
    const calculateTotal = () => {
        const { pickupDate, returnDate } = formData;
        if (pickupDate && returnDate) {
            const days = Math.max(
                1,
                Math.ceil(
                    (new Date(returnDate) - new Date(pickupDate)) /
                    (1000 * 60 * 60 * 24)
                )
            );
            return days * service.price
        }
        return service.price;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking Data:', formData);
        toast.success('Booking confirmed!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setFormData(initialForm);
    };

    const handleFocus = (field) => {
        setActiveField(field)
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    return (
        <div className={carDetailStyles.pageContainer}>
            {/*Main Content*/}
            <div className={carDetailStyles.contentContainer}>
                <ToastContainer />
                <button onClick={() => navigate(-1)} className={carDetailStyles.backButton}>
                    <FaArrowLeft className={carDetailStyles.backButtonIcon} />
                </button>

                <div className={carDetailStyles.mainLayout}>
                    <div className={carDetailStyles.leftColumn}>
                        <div className={carDetailStyles.imageCarousel}>
                            <img src={serviceImages[currentImage]} alt={service.name} className={carDetailStyles.carImage} />
                            {serviceImages.length > 1 && (
                                <div className={carDetailStyles.carouselIndicators}>
                                    {serviceImages.map((_, idx) => (
                                        <button key={idx} onClick={() => setCurrentImage(idx)} className={carDetailStyles.carouselIndicator(idx === currentImage)}>

                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <h1 className={carDetailStyles.carName}>
                            {service.name}
                        </h1>
                        <p className={carDetailStyles.carPrice}>
                            ₹{service.price} <span className={carDetailStyles.pricePerDay}>/Inspection</span>
                        </p>

                        <div className={carDetailStyles.specsGrid}>
                            {[
                                { Icon: FaUserFriends, label: 'Seats', value: servicesData.name, color: 'text-orange-400' },
                                { Icon: FaClock, label: 'Duration', value: servicesData.duration, color: 'text-green-400' },
                                { Icon: FaTools, label: 'Dignost', value: servicesData.duration, color: 'text-yellow-400' },
                                { Icon: FaCheckCircle, label: 'Type', value: servicesData.type, color: 'text-purple-400' },

                            ].map((spec, idx) => (
                                <div key={idx} className={carDetailStyles.specCard}>
                                    <spec.Icon className={`${spec.color} ${carDetailStyles.specIcon}`} />
                                    <p className={carDetailStyles.specLabel}>{spec.label}</p>
                                    <p className={carDetailStyles.specValue}>{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        {/**About Section */}
                        <div className={carDetailStyles.aboutSection}>
                            <h2 className={carDetailStyles.aboutTitle}>About This Service</h2>
                            <p className={carDetailStyles.aboutText}>
                                Ensure your EV battery is performing at its best with a comprehensive health inspection, diagnostics, and performance analysis.
                            </p>
                            <p className={carDetailStyles.aboutText}>
                                {servicesData.description || 'This Service will provide longer life to your battery health.'}
                            </p>
                        </div>
                    </div>

                    {/*Right Side*/}
                    <div className={carDetailStyles.rightColumn}>
                        <div className={carDetailStyles.bookingCard}>
                            <h2 className={carDetailStyles.bookingTitle}>
                                Reserve <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500'>Your Booking</span>
                            </h2>
                            <p className={carDetailStyles.bookingSubtitle}>
                                Longlife &bull; Fast &bull; performence
                            </p>

                            <form onSubmit={handleSubmit} className={carDetailStyles.form}>
                                <div className={carDetailStyles.grid2}>
                                    <div className='flex flex-col'>
                                        <label htmlFor="pickupplace" className={carDetailStyles.formLabel}>
                                            Pickup State Distict
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'pickupplace')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaMapMarked />
                                            </div>
                                            <input type="text" id='pickupLocation' name='pickupLocation' placeholder='Enter State/District' onChange={handleInputChange}
                                                value={formData.pickupLocation} onFocus={() => handleFocus('pickupState')} onBlur={handleBlur} required className={carDetailStyles.inputField} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="pickuptiming" className={carDetailStyles.formLabel}>
                                            Pickup Timing
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'pickupplace')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaClock />
                                            </div>
                                            <input type="number" id='pickuptime' placeholder='pickup timing' name='pickuptime' onChange={handleInputChange}
                                                value={formData.pickupTime} onFocus={() => handleFocus('pickuptime')} onBlur={handleBlur}  className={carDetailStyles.inputField} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className={carDetailStyles.formLabel}>
                                            Pickup Location
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'pickupLocation')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaMapMarkedAlt />
                                            </div>
                                            <input type="text" id='pickupLocation' placeholder='Enter nearest LandMark' name='pickupLocation' onChange={handleInputChange}
                                                value={formData.pickupLocation} onFocus={() => handleFocus('pickupLocation')} onBlur={handleBlur} required className={carDetailStyles.inputField} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className={carDetailStyles.formLabel}>
                                            Full Name
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'name')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaUser />
                                            </div>
                                            <input type="text" id='name' placeholder='Your Full Name' name='name' onChange={handleInputChange}
                                                value={formData.name} onFocus={() => handleFocus('name')} onBlur={handleBlur} required className={carDetailStyles.inputField} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className={carDetailStyles.formLabel}>
                                            email Address
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'email')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaEnvelope />
                                            </div>
                                            <input type="email" id='email' placeholder='Your email' name='email' onChange={handleInputChange}
                                                value={formData.email} onFocus={() => handleFocus('email')} onBlur={handleBlur} required className={carDetailStyles.inputField} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className={carDetailStyles.formLabel}>
                                            Phone Number
                                        </label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'email')}>
                                            <div className={carDetailStyles.inputIcon}>
                                                <FaPhone />
                                            </div>
                                            <input type="tel" id='phone' placeholder='Your Contact' name='Phone' onChange={handleInputChange}
                                                value={formData.phone} onFocus={() => handleFocus('phone')} onBlur={handleBlur} required className={carDetailStyles.inputField} />
                                        </div>
                                    </div>
                                </div>

                                <div className={carDetailStyles.priceBreakdown}>
                                    <div className={carDetailStyles.priceRow}>
                                        <span>Rate/day</span>
                                        <span>₹{servicesData.price}</span>
                                    </div>
                                    {formData.pickupDate && formData.returnDate && (
                                        <div className={carDetailStyles.priceRow}>
                                            <span>Days</span>
                                            <span>{Math.max(1, Math.ceil((new Date(formData.returnDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24)))}</span>
                                        </div>
                                    )}
                                    <div className={carDetailStyles.totalRow}>
                                        <span>Total</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>

                                <button type='submit' className={carDetailStyles.submitButton}>
                                    <FaCreditCard className='mr-2 group-hover:scale-110 transition-transform' />
                                    <span>Confirm Booking</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesDetails
