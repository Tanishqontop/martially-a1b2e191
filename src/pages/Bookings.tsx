import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Bookings = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          classes (
            style,
            instructor,
            schedule,
            training_center_id,
            training_centers (
              name,
              location
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading your bookings...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Style</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Training Center</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.classes?.style}</TableCell>
              <TableCell>{booking.classes?.instructor}</TableCell>
              <TableCell>
                {booking.classes?.training_centers?.name}
                <br />
                <span className="text-sm text-gray-500">
                  {booking.classes?.training_centers?.location}
                </span>
              </TableCell>
              <TableCell>{booking.classes?.schedule}</TableCell>
              <TableCell>₹{booking.amount}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  booking.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {booking.payment_id || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Bookings;