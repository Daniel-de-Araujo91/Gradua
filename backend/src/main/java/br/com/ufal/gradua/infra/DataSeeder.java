package br.com.ufal.gradua.infra;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.models.auth.StudentModel;
import br.com.ufal.gradua.models.auth.ProfessorModel;
import br.com.ufal.gradua.models.institutional.SubjectModel;
import br.com.ufal.gradua.models.academic.ClassSectionModel;
import br.com.ufal.gradua.models.academic.EnrollmentModel;
import br.com.ufal.gradua.models.auth.MonitorModel;
import br.com.ufal.gradua.models.agenda.MonitorSessionModel;
import br.com.ufal.gradua.models.forum.ForumTopicModel;
import br.com.ufal.gradua.models.agenda.NotificationModel;
import br.com.ufal.gradua.repositories.UserRepository;
import br.com.ufal.gradua.repositories.StudentRepository;
import br.com.ufal.gradua.repositories.ProfessorRepository;
import br.com.ufal.gradua.repositories.SubjectRepository;
import br.com.ufal.gradua.repositories.ClassSectionRepository;
import br.com.ufal.gradua.repositories.EnrollmentRepository;
import br.com.ufal.gradua.repositories.MonitorRepository;
import br.com.ufal.gradua.repositories.MonitorSessionRepository;
import br.com.ufal.gradua.repositories.ForumTopicRepository;
import br.com.ufal.gradua.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = false)
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MonitorRepository monitorRepository;
    private final MonitorSessionRepository monitorSessionRepository;
    private final ForumTopicRepository forumTopicRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Run seeding in a background thread so failures won't prevent app startup
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                // ADMIN (preserva comportamento anterior)
                String adminCpf = "00000000000";
                if (userRepository.findByCpfOrPassport(adminCpf).isEmpty()) {
                    log.info("Criando conta de ADMIN padrão para testes...");
                    UserModel admin = new UserModel();
                    admin.setFirstName("Admin");
                    admin.setLastName("Teste");
                    admin.setEmail("admin@gradua.ufal.br");
                    admin.setCpf(adminCpf);
                    admin.setPasswordHash(passwordEncoder.encode("admin123"));
                    admin.setRole("ADMIN");
                    admin.setIsForeigner(false);
                    userRepository.save(admin);
                    log.info("Conta ADMIN criada: CPF={} / Senha={}", adminCpf, "admin123");
                } else {
                    log.info("Conta ADMIN padrão já existe.");
                }

                // Cria dados de demonstração se não existirem
                String studentCpf = "11111111111";
                if (userRepository.findByCpfOrPassport(studentCpf).isEmpty()) {
                    log.info("Criando dados de demonstração: Student/Professor/Subjects/Turmas...");

                    // Student user
                    UserModel studentUser = new UserModel();
                    studentUser.setFirstName("Tester");
                    studentUser.setLastName("Silva");
                    studentUser.setEmail("tester@gradua.ufal.br");
                    studentUser.setCpf(studentCpf);
                    studentUser.setPasswordHash(passwordEncoder.encode("student123"));
                    studentUser.setRole("USER");
                    studentUser.setIsForeigner(false);
                    userRepository.save(studentUser);

                    StudentModel student = new StudentModel();
                    student.setStudentID(java.util.UUID.randomUUID());
                    student.setEnrollmentNumber("2026001");
                    student.setCurrentTerm(4);
                    student.setIra(new BigDecimal("7.50"));
                    student.setMandatoryHours(180);
                    student.setElectiveHours(20);
                    student.setComplementaryHours(10);
                    student.setTotalHours(210);
                    student.setUser(studentUser);
                    studentRepository.save(student);

                    // Link student back to user so SecurityContextHolder can access user.getStudent()
                    studentUser.setStudent(student);
                    userRepository.save(studentUser);

                    // Professor user
                    UserModel profUser = new UserModel();
                    profUser.setFirstName("Maria");
                    profUser.setLastName("Santos");
                    profUser.setEmail("maria.santos@gradua.ufal.br");
                    profUser.setPasswordHash(passwordEncoder.encode("prof123"));
                    profUser.setRole("PROFESSOR");
                    profUser.setIsForeigner(false);
                    // ensure professor can also login via CPF for tests
                    profUser.setCpf("22222222222");
                    userRepository.save(profUser);

                    ProfessorModel professor = new ProfessorModel();
                    professor.setProfessorID(java.util.UUID.randomUUID());
                    professor.setUser(profUser);
                    professorRepository.save(professor);

                    // link professor back to user for convenience
                    profUser.setProfessor(professor);
                    userRepository.save(profUser);

                    // Subjects
                    SubjectModel subj1 = new SubjectModel();
                    subj1.setSubjectId(java.util.UUID.randomUUID());
                    subj1.setCode("PROG2");
                    subj1.setName("Programação 2");
                    subj1.setCreditHours(80);
                    subjectRepository.save(subj1);

                    SubjectModel subj2 = new SubjectModel();
                    subj2.setSubjectId(java.util.UUID.randomUUID());
                    subj2.setCode("TDC");
                    subj2.setName("Teoria da Computação");
                    subj2.setCreditHours(60);
                    subjectRepository.save(subj2);

                    // Class sections
                    ClassSectionModel class1 = new ClassSectionModel();
                    class1.setClassId(java.util.UUID.randomUUID());
                    class1.setSubject(subj1);
                    class1.setProfessor(professor);
                    class1.setAcademicTerm("2026.1");
                    classSectionRepository.save(class1);

                    ClassSectionModel class2 = new ClassSectionModel();
                    class2.setClassId(java.util.UUID.randomUUID());
                    class2.setSubject(subj2);
                    class2.setProfessor(professor);
                    class2.setAcademicTerm("2026.1");
                    classSectionRepository.save(class2);

                    // Enrollment
                    EnrollmentModel en1 = new EnrollmentModel();
                    en1.setEnrollmentId(java.util.UUID.randomUUID());
                    en1.setStudent(student);
                    en1.setClassSection(class1);
                    en1.setStatus(null);
                    en1.setAbsences(1);
                    enrollmentRepository.save(en1);

                    EnrollmentModel en2 = new EnrollmentModel();
                    en2.setEnrollmentId(java.util.UUID.randomUUID());
                    en2.setStudent(student);
                    en2.setClassSection(class2);
                    en2.setStatus(null);
                    en2.setAbsences(0);
                    enrollmentRepository.save(en2);

                    // Monitor (same student acts as monitor for class1)
                    MonitorModel monitor = new MonitorModel();
                    monitor.setMonitorId(java.util.UUID.randomUUID());
                    monitor.setScholarshipType("BOLSISTA");
                    monitor.setStudent(student);
                    monitorRepository.save(monitor);

                    // Monitor session today
                    MonitorSessionModel session = new MonitorSessionModel();
                    session.setSessionId(java.util.UUID.randomUUID());
                    session.setMonitor(monitor);
                    session.setClassSection(class1);
                    session.setTopic("Plantão de dúvidas - Programação 2");
                    session.setDate(LocalDate.now());
                    session.setStartTime(LocalTime.of(15, 0));
                    session.setEndTime(LocalTime.of(16, 0));
                    session.setLocation("Sala 101");
                    session.setMeetingLink(null);
                    monitorSessionRepository.save(session);

                    // Notification example for student
                    NotificationModel notif = new NotificationModel();
                    notif.setNotificationId(java.util.UUID.randomUUID());
                    notif.setRecipientUser(studentUser);
                    notif.setMonitorSession(session);
                    notif.setMessage("Sessão de monitoria de Programação 2 marcada para hoje às 15:00.");
                    notif.setIsRead(false);
                    notif.setCreatedAt(java.time.LocalDateTime.now());
                    notificationRepository.save(notif);

                    // Forum aviso
                    ForumTopicModel aviso = new ForumTopicModel();
                    aviso.setTopicId(java.util.UUID.randomUUID());
                    aviso.setAuthor(profUser);
                    aviso.setTitle("Aula remota amanhã");
                    aviso.setContent("A aula de Programação 2 de amanhã será via Google Meet.");
                    aviso.setCreationDate(java.time.LocalDateTime.now());
                    aviso.setType("AVISO");
                    aviso.setIsEdited(false);
                    aviso.setVoteScore(null);
                    aviso.setCommentCount(0);
                    forumTopicRepository.save(aviso);

                    log.info("Dados de demonstração criados com sucesso.");
                } else {
                    log.info("Dados de demonstração já existem. Pulando seed adicional.");
                }
            } catch (Exception ex) {
                // Top-level protection for the async runner
                log.warn("Erro inesperado no DataSeeder (async): {}", ex.getMessage());
                log.debug("Stacktrace do erro no DataSeeder (async):", ex);
            }
        });
    }
}
