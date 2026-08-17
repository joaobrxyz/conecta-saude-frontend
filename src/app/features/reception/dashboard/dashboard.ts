import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type PatientStatus = 'late' | 'confirmed' | 'waiting' | 'in_progress' | 'no_show' | 'cancelled';
type RoomStatus = 'busy' | 'free' | 'absent' | 'break';

interface Patient {
  id: number; name: string; initials: string; avatarColor: string; time: string; doctor: string; specialty: string; room: string; status: PatientStatus; lateMin?: number; waitMin?: number; cpf: string; phone: string; checkedIn: boolean;
}

interface Room {
  id: number; number: string; doctor: string; specialty: string; status: RoomStatus; busyMin?: number; nextIn?: string; avatarColor: string; initial: string;
}

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  patients: Patient[] = [
    { id: 1, name: "Marina Costa", initials: "MC", avatarColor: "from-[#DC2626] to-[#F87171]", time: "14:00", doctor: "Dr. Rafael Silva", specialty: "Cardiologia", room: "Sala 1", status: "late", lateMin: 15, cpf: "321.654.987-11", phone: "(11) 97811-2234", checkedIn: false },
    { id: 2, name: "Bruno Henrique", initials: "BH", avatarColor: "from-[#7C3AED] to-[#A78BFA]", time: "14:30", doctor: "Dra. Ana Souza", specialty: "Dermatologia", room: "Sala 2", status: "confirmed", cpf: "148.923.007-45", phone: "(11) 98200-5567", checkedIn: false },
    { id: 3, name: "Lúcia Ferreira", initials: "LF", avatarColor: "from-[#D97706] to-[#FCD34D]", time: "13:45", doctor: "Dr. Rafael Silva", specialty: "Cardiologia", room: "Sala 1", status: "waiting", waitMin: 22, cpf: "560.112.843-88", phone: "(11) 95544-3312", checkedIn: true },
    { id: 4, name: "Carlos Menezes", initials: "CM", avatarColor: "from-[#0891B2] to-[#67E8F9]", time: "14:45", doctor: "Dr. Marcos Oliveira", specialty: "Clínica Geral", room: "Sala 3", status: "confirmed", cpf: "894.237.106-22", phone: "(11) 99001-4488", checkedIn: false },
  ];

  rooms: Room[] = [
    { id: 1, number: "Sala 1", doctor: "Dr. Rafael Silva", specialty: "Cardiologia", status: "busy", busyMin: 12, nextIn: "14:30", avatarColor: "from-[#1565C0] to-[#42A5F5]", initial: "R" },
    { id: 2, number: "Sala 2", doctor: "Dra. Ana Souza", specialty: "Dermatologia", status: "free", nextIn: "14:30", avatarColor: "from-[#16A34A] to-[#34D399]", initial: "A" },
    { id: 3, number: "Sala 3", doctor: "Dr. Marcos Oliveira", specialty: "Clínica Geral", status: "absent", nextIn: "15:00", avatarColor: "from-[#D97706] to-[#FCD34D]", initial: "M" },
  ];

  activities = [
    { id: 1, text: "Check-in realizado — Lúcia Ferreira", time: "13:52", icon: "bi-check-circle", color: "#16A34A" },
    { id: 2, text: "Agendamento cancelado — Paulo Martins", time: "13:48", icon: "bi-x-circle", color: "#DC2626" },
    { id: 3, text: "Novo agendamento — Beatriz Cunha", time: "13:41", icon: "bi-calendar", color: "#1565C0" },
  ];

  activeFilter: 'all' | 'pending' | 'waiting' | 'noshow' = 'all';
  checkInTarget: Patient | null = null;
  showNewAppt: boolean = false;
  apptStep: number = 1;
  successToast: string | null = null;

  get filteredPatients() {
    return this.patients.filter(p => {
      if (this.activeFilter === 'pending') return !p.checkedIn && p.status !== 'no_show';
      if (this.activeFilter === 'waiting') return p.status === 'waiting';
      if (this.activeFilter === 'noshow') return p.status === 'no_show';
      return true;
    });
  }

  get waitingPatients() {
    return this.patients.filter(p => p.checkedIn && p.status === 'waiting');
  }

  // Stats Counters
  get countAgendados() { return this.patients.filter(p => p.status !== 'no_show' && p.status !== 'cancelled').length + 35; }
  get countPendentes() { return this.patients.filter(p => !p.checkedIn && p.status !== 'no_show' && p.status !== 'cancelled').length; }
  get countEspera() { return this.patients.filter(p => p.status === 'waiting').length; }
  get countFaltas() { return this.patients.filter(p => p.status === 'no_show').length + 2; }

  handleCheckIn() {
    if (!this.checkInTarget) return;
    const patient = this.patients.find(p => p.id === this.checkInTarget?.id);
    if (patient) {
      patient.checkedIn = true;
      patient.status = 'waiting';
      patient.waitMin = 0;
    }
    this.successToast = `Check-in de ${this.checkInTarget.name} realizado com sucesso!`;
    setTimeout(() => this.successToast = null, 3000);
    this.checkInTarget = null;
  }

  getPatientStatusConfig(status: PatientStatus, lateMin?: number, waitMin?: number) {
    const map: Record<PatientStatus, { label: string; cls: string; dot: string }> = {
      late:        { label: lateMin ? `Atrasado ${lateMin} min` : "Atrasado", cls: "text-[#DC2626] bg-[#FEF2F2] border-[rgba(220,38,38,0.2)]", dot: "bg-[#DC2626] animate-pulse" },
      confirmed:   { label: "Confirmado",          cls: "text-[#5A6A85] bg-[#F3F6FB] border-[rgba(90,106,133,0.15)]", dot: "bg-[#9AAAC0]" },
      waiting:     { label: waitMin ? `Aguardando ${waitMin} min` : "Aguardando", cls: "text-[#D97706] bg-[#FFFBEB] border-[rgba(217,119,6,0.2)]", dot: "bg-[#D97706] animate-pulse" },
      in_progress: { label: "Em Atendimento",      cls: "text-[#16A34A] bg-[#F0FDF4] border-[rgba(22,163,74,0.2)]", dot: "bg-[#16A34A] animate-pulse" },
      no_show:     { label: "Não Compareceu",      cls: "text-[#DC2626] bg-[#FEF2F2] border-[rgba(220,38,38,0.2)]", dot: "bg-[#DC2626]" },
      cancelled:   { label: "Cancelado",           cls: "text-[#9AAAC0] bg-[#F3F6FB] border-[rgba(154,170,192,0.15)]", dot: "bg-[#C8D4E4]" },
    };
    return map[status];
  }

  getRoomConfig(status: RoomStatus) {
    const map: Record<RoomStatus, { label: string; dot: string; cls: string; border: string; bg: string }> = {
      busy:   { label: "Em Atend.", dot: "bg-[#16A34A] animate-pulse", cls: "text-[#16A34A]", border: "border-[rgba(22,163,74,0.2)]", bg: "bg-[#F8FFFE]" },
      free:   { label: "Livre",     dot: "bg-[#1565C0]",               cls: "text-[#1565C0]", border: "border-[rgba(21,101,192,0.15)]", bg: "bg-[#F8FBFF]" },
      absent: { label: "Ausente",   dot: "bg-[#9AAAC0]",               cls: "text-[#8A9AB8]", border: "border-[#EDF2FA]", bg: "bg-white" },
      break:  { label: "Intervalo", dot: "bg-[#D97706]",               cls: "text-[#D97706]", border: "border-[rgba(217,119,6,0.15)]", bg: "bg-[#FFFCF5]" },
    };
    return map[status];
  }
}