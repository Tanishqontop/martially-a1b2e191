
import { supabase } from "@/integrations/supabase/client";

export const seedTrainingCenters = async () => {
  try {
    // Check if data already exists
    const { data: existingCenters, error: checkError } = await supabase
      .from('training_centers')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    if (existingCenters && existingCenters.length > 0) {
      console.log('Training centers already exist, skipping seed');
      return;
    }

    // Insert sample training centers
    const sampleCenters = [
      {
        name: "Dragon Martial Arts Academy",
        location: "Mumbai, Maharashtra",
        description: "A premier martial arts academy offering comprehensive training in multiple disciplines including Karate, Taekwondo, and MMA.",
        slug: "dragon-martial-arts-academy",
        rating: 4.8,
        image_url: "/karate.jpg"
      },
      {
        name: "Phoenix Fight Club",
        location: "Delhi, Delhi",
        description: "Modern MMA training facility with professional fighters and state-of-the-art equipment.",
        slug: "phoenix-fight-club",
        rating: 4.6,
        image_url: "/mma.jpg"
      },
      {
        name: "Shaolin Temple India",
        location: "Bangalore, Karnataka",
        description: "Traditional Kung Fu training with authentic Shaolin techniques and philosophy.",
        slug: "shaolin-temple-india",
        rating: 4.9,
        image_url: "/kungfu.jpg"
      },
      {
        name: "Tiger Muay Thai Center",
        location: "Pune, Maharashtra",
        description: "Authentic Muay Thai training with experienced Thai instructors.",
        slug: "tiger-muay-thai-center",
        rating: 4.7,
        image_url: "/muaythai.jpg"
      }
    ];

    const { data, error } = await supabase
      .from('training_centers')
      .insert(sampleCenters);

    if (error) {
      console.error('Error seeding training centers:', error);
      return;
    }

    console.log('Training centers seeded successfully');
  } catch (error) {
    console.error('Error in seedTrainingCenters:', error);
  }
};

export const seedClasses = async () => {
  try {
    // Get training centers first
    const { data: centers, error: centersError } = await supabase
      .from('training_centers')
      .select('id, slug');

    if (centersError || !centers || centers.length === 0) {
      console.error('No training centers found for seeding classes');
      return;
    }

    // Check if classes already exist
    const { data: existingClasses, error: checkError } = await supabase
      .from('classes')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing classes:', checkError);
      return;
    }

    if (existingClasses && existingClasses.length > 0) {
      console.log('Classes already exist, skipping seed');
      return;
    }

    // Create sample classes for each center
    const sampleClasses = [
      {
        training_center_id: centers[0].id,
        style: "Karate",
        instructor: "Sensei Ravi Kumar",
        schedule: "Mon, Wed, Fri - 6:00 PM",
        price: 3000,
        image_url: "/karate.jpg"
      },
      {
        training_center_id: centers[0].id,
        style: "Taekwondo",
        instructor: "Master Sarah Lee",
        schedule: "Tue, Thu, Sat - 5:00 PM",
        price: 3500,
        image_url: "/tkd.jpg"
      },
      {
        training_center_id: centers[1].id,
        style: "MMA",
        instructor: "Coach Mike Johnson",
        schedule: "Daily - 7:00 AM",
        price: 5000,
        image_url: "/mma.jpg"
      },
      {
        training_center_id: centers[2].id,
        style: "Kung Fu",
        instructor: "Master Chen Li",
        schedule: "Mon, Wed, Fri - 7:00 PM",
        price: 4000,
        image_url: "/kungfu.jpg"
      },
      {
        training_center_id: centers[3].id,
        style: "Muay Thai",
        instructor: "Kru Somchai",
        schedule: "Tue, Thu, Sat - 6:30 PM",
        price: 4500,
        image_url: "/muaythai.jpg"
      }
    ];

    const { data, error } = await supabase
      .from('classes')
      .insert(sampleClasses);

    if (error) {
      console.error('Error seeding classes:', error);
      return;
    }

    console.log('Classes seeded successfully');
  } catch (error) {
    console.error('Error in seedClasses:', error);
  }
};
